import { type Rspack } from '@rsbuild/core';
import path from 'node:path';
import fs from 'node:fs/promises';

export const StripBlankLinesPlugin = (): Rspack.Plugin => (compiler: Rspack.Compiler) => {
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
          const formatted = src.replace(/\n{3,}/g, '\n\n').replace(/(\/\/ )(CONCATENATED MODULE: )(\.\/src\/)/g, '$1file://$3');
          await fs.writeFile(filePath, formatted, 'utf8');
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
