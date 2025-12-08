import { type Rspack } from '@rsbuild/core';
import path from 'node:path';
import fs from 'node:fs/promises';
import prettier from 'prettier';

export const PrettierPlugin = (): Rspack.Plugin => (compiler: Rspack.Compiler) => {
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
          const formatted = await prettier.format(src, {
            filepath: filePath,
            endOfLine: 'lf',
            arrowParens: 'avoid',
            bracketSpacing: true,
            bracketSameLine: true,
            objectWrap: 'collapse',
            proseWrap: 'never',
            quoteProps: 'as-needed',
            semi: true,
            htmlWhitespaceSensitivity: 'ignore',
            experimentalOperatorPosition: 'start',
            trailingComma: 'all',
          });
          await fs.writeFile(filePath, formatted, 'utf8');
        } catch (err) {
          // keep going on errors (file may be in-memory, missing, or unparseable)
          // eslint-disable-next-line no-console
          console.warn('[PrettierAfterBuild] skip', name, err?.['message'] ?? err);
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[PrettierAfterBuild] plugin failed', err);
    }
  });
};
