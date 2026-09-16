import { type Rspack } from '@rsbuild/core';
import path from 'node:path';
import fs from 'node:fs/promises';

// `watchStatsDisplay` -> `wsd`
const initials = (name: string) => (name.match(/^[a-z]|[A-Z]/g) ?? []).join('').toLowerCase();

/**
 * Module concatenation deconflicts top-level names by prefixing the module name
 * (`watchStatsDisplay_int`), and names CSS default exports `<file>raw`.
 * Shorten the prefix to the module's initials (`wsd_int`, `vc_css`), skipping any name that would collide.
 */
function shortenModulePrefixes(src: string) {
  const modules = new Set([...src.matchAll(/^;\/\/ file:\/\/\S*\/(\w+)\.\w+(?:\?raw)?$/gm)].map(m => m[1]!));
  if (!modules.size) return src;
  const alternatives = [...modules].sort((a, b) => b.length - a.length).join('|');
  const declared = new RegExp(`(?:const|let|var|function|class) (?:(${alternatives})_(\\w+)|(${alternatives})raw)\\b`, 'g');
  const found = [...src.matchAll(declared)];
  // one prefix per module: initials when the module name has several words and no other module shares them
  const prefixes = new Map<string, string>();
  const byInitials = new Map<string, string[]>();
  for (const mod of new Set(found.map(m => m[1] ?? m[3]!))) {
    const short = initials(mod);
    byInitials.set(short, [...(byInitials.get(short) ?? []), mod]);
  }
  for (const [short, mods] of byInitials)
    for (const mod of mods) prefixes.set(mod, short.length > 1 && mods.length === 1 ? short : mod);
  const taken = new Set(src.match(/[\w$]+/g));
  const renames = new Map<string, string>();
  for (const [old, mod, rest, cssMod] of found) {
    const name = old.replace(/^\w+ /, '');
    const short = rest ? `${prefixes.get(mod!)}_${rest}` : `${prefixes.get(cssMod!)}_css`;
    if (renames.has(name) || taken.has(short)) continue;
    taken.add(short);
    renames.set(name, short);
  }
  if (!renames.size) return src;
  // not after `.` (property access) nor inside other identifiers
  const uses = new RegExp(`(?<![\\w$.])(?:${[...renames.keys()].join('|')})(?![\\w$])`, 'g');
  return src.replace(uses, name => renames.get(name)!);
}

export function StripBlankLinesPlugin(
  formatFn = (src: string) => {
    return shortenModulePrefixes(
      src
        // externals are @require'd globals: `(0,external_preact_namespaceObject.render)` -> `preact.render`
        .replace(/;\/\/ CONCATENATED MODULE: external "\w+"\nconst external_(\w+)_namespaceObject = window\.\1;\n/g, '')
        .replace(/\(0,external_(\w+)_namespaceObject\.(\w+)\)/g, '$1.$2')
        // `/* export default */ const x = (`...`);` -> `const x = `...`;`
        .replace(/^\/\* export default \*\/ (const \w+ = )\((`[^`]*`)\);$/gm, '$1$2;')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/(\/\/ )(CONCATENATED MODULE: )(\.\/)/g, '$1file://$3')
    );
  }
): Rspack.Plugin {
  return (compiler: Rspack.Compiler) => {
    compiler.hooks.done.tapPromise('PrettierAfterBuild', async (stats) => {
      try {
        // try to get the output path from compiler options, fallback to cwd
        const outPath = (compiler.options && compiler.options.output && compiler.options.output.path) || process.cwd();
        // stats.toJson({ assets: true }) should contain built asset names
        const json = (typeof stats.toJson === 'function' && stats.toJson({ assets: true })) || {};
        const assets = json.assets || [];
        for (const asset of assets) {
          const name = asset?.name;
          if (!name?.endsWith('.user.js')) continue;
          const filePath = path.join(outPath, name);
          try {
            const src = await fs.readFile(filePath, 'utf8');
            await fs.writeFile(filePath, formatFn(src), 'utf8');
          } catch (err) {
            // keep going on errors (file may be in-memory, missing, or unparseable)
            // eslint-disable-next-line no-console
            console.warn('[StripBlankLinesPlugin] skip', name, err?.['message'] ?? err);
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[StripBlankLinesPlugin] plugin failed', err);
      }
    });
  };
}
