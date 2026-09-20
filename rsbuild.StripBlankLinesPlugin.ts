import { type Rspack } from '@rsbuild/core';
import path from 'node:path';
import fs from 'node:fs/promises';
import prettier from 'prettier';

// `watchStatsDisplay` -> `wsd`
const initials = (name: string) => (name.match(/^[a-z]|[A-Z]/g) ?? []).join('').toLowerCase();

/**
 * Module concatenation deconflicts top-level names by prefixing the module name
 * (`watchStatsDisplay_int`), and names CSS default exports `<file>raw`.
 * Shorten the prefix to the module's initials (`wsd_int`, `vc_css`), skipping any name that would collide.
 */
function shortenModulePrefixes(src: string) {
  const modules = new Set([...src.matchAll(/^\/\/ file:\/\/\S*\/(\w+)\.\w+(?:\?raw)?$/gm)].map(m => m[1]!));
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

/**
 * Template literals (the CSS lives in those), strings, regex literals and comments, matched in one pass: whichever
 * opens first wins, so a `"//…"` isn't read as a comment, a `// don't` isn't read as a string, and the quotes
 * inside a `/[&<>"']/` aren't read as either.
 */
const CODE_NOISE =
  /`(?:\\.|[^\\`])*`|\/\*[\s\S]*?\*\/|\/\/[^\n]*|(?<=[(,=:;[!&|?{}]\s*)\/(?![*\/])(?:\\.|\[(?:\\.|[^\]\\\n])*\]|[^\\\/\n])+\/[a-z]*|'(?:\\.|[^\\'])*'|"(?:\\.|[^\\"])*"/g;

/** Every identifier the code declares or reads, ignoring that noise and property names (`preact.h` declares no `h`) */
const codeIdentifiers = (src: string) =>
  new Set(
    src
      .replace(CODE_NOISE, ' ')
      .replace(/\.\s*[A-Za-z_$][\w$]*/g, '')
      .match(/[A-Za-z_$][\w$]*/g) ?? []
  );

/** Belt and braces for the check above: a name something else declares is never taken for an alias */
const isDeclared = (src: string, name: string) => new RegExp(`(?:const|let|var|function|class)\\s+${name}\\b`).test(src);

/**
 * The externals are the @require'd globals, reached through a handful of members each. Declare those members
 * where webpack declared the global, so the code below reads `h(...)` and `useState(...)`.
 * A member whose name is already used for something else stays qualified (`preact.render`).
 */
function declareExternalMembers(src: string) {
  const taken = codeIdentifiers(src);
  const externals = [...src.matchAll(/;\/\/ CONCATENATED MODULE: external "(\w+)"\nconst external_\1_namespaceObject = window\.\1;\n/g)];
  for (const [block, global] of externals) {
    const used = new Set(Array.from(src.matchAll(new RegExp(`(?<![\\w$.])${global}\\.(\\w+)`, 'g')), m => m[1]!));
    const members = [...used].filter(member => !taken.has(member) && !isDeclared(src, member));
    src = src.replace(block!, members.length ? `const { ${members.join(', ')} } = window.${global};\n` : '');
    for (const member of members) src = src.replaceAll(`${global}.${member}`, member);
  }
  return src;
}

/** The style the bundle is written in: the loader's, on lines long enough to keep it compact */
const PRETTIER_OPTIONS: prettier.Options = {
  parser: 'babel',
  printWidth: 160,
  useTabs: true,
  tabWidth: 2,
  arrowParens: 'avoid',
  experimentalOperatorPosition: 'start',
  objectWrap: 'collapse',
  bracketSameLine: true,
  endOfLine: 'lf',
};

export function StripBlankLinesPlugin(
  formatFn = async (src: string) => {
    const prepared = declareExternalMembers(
      // externals are @require'd globals: `(0,external_preact_namespaceObject.render)` -> `preact.render`
      src.replace(/\(0,external_(\w+)_namespaceObject\.(\w+)\)/g, '$1.$2')
    )
      // `/* export default */ const x = (`...`);` -> `const x = `...`;`
      .replace(/^\/\* export default \*\/ (const \w+ = )\((`[^`]*`)\);$/gm, '$1$2;')
      // the module markers, on their own line: prettier drops the leading `;` and glues the comment to the code above
      .replace(/(?:\n|^);\/\/ CONCATENATED MODULE: (\S+)/g, '\n\n// file://$1');

    return shortenModulePrefixes((await prettier.format(prepared, PRETTIER_OPTIONS)).replace(/\n{3,}/g, '\n\n'));
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
            await fs.writeFile(filePath, await formatFn(src), 'utf8');
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
