import { defineConfig, rspack, type Rspack } from '@rsbuild/core';
import { getManifest } from './manifest';
import path from 'node:path';
import fs from 'node:fs/promises';
import prettier from 'prettier';

const isDev = process.env.NODE_ENV !== 'development';

const PrettierPlugin: Rspack.Plugin = (compiler: Rspack.Compiler) => {
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

export default defineConfig({
  mode: 'production', // concatenate modules even on `rsbuild watch`
  tools: {
    htmlPlugin: false,
    lightningcssLoader: {
      minify: false,
      exclude: {
        // exclude from processing; what you'd like to keep;
        nesting: true,
      },
    },
    rspack: {
      externals: {
        jspanel4: 'jsPanel',
      },

      plugins: [
        new rspack.BannerPlugin({
          banner: getManifest(),
          raw: true, // false = wraps into a comment
          entryOnly: true,
        }),
        PrettierPlugin,
      ],
      experiments: {
        outputModule: true,
        topLevelAwait: true,
      },
      optimization: {
        runtimeChunk: false,
        splitChunks: false,
        concatenateModules: true,
        usedExports: true,
        innerGraph: true,
        providedExports: true,
        removeAvailableModules: true,
        avoidEntryIife: true,
        minimize: false,
        moduleIds: 'named',
        chunkIds: 'named',
      },
    },
    swc: {
      minify: false,
      module: {
        type: 'es6',
      },
      isModule: 'unknown',
      jsc: {
        externalHelpers: true,
        transform: {
          react: {
            runtime: 'automatic',
          },
          optimizer: {
            simplify: true,
          },
        },
        minify: {
          compress: {
            defaults: false,
            module: true,
            const_to_let: false,
            collapse_vars: true,
            unused: true,
            dead_code: true,
            drop_console: !isDev,
            drop_debugger: !isDev,
            booleans: false,
            booleans_as_integers: false,
            conditionals: false,
            join_vars: false,
            loops: false,
            side_effects: true,
          },
          mangle: false,
          module: true,
          format: {
            comments: false,
          },
        },
      },
    },
  },

  plugins: [],
  source: {
    entry: {
      betterbw: './src/betterbw/index.ts',
    },
  },
  performance: {
    // removeConsole: ['log'], // This just removes the `console.log(` and the `)`, but continue calling every parameter; Prefer swc.jsc.minify.compress.drop_console = true
  },
  output: {
    target: 'web',
    minify: false,
    overrideBrowserslist: ['last 2 chrome version', 'last 2 firefox version'],
    module: true,
    legalComments: 'inline',
    filename: {
      js: isDev ? '[name].user.js' : '[name].[contenthash:8].user.js',
    },
  },

  dev: {
    writeToDisk: true, // https://rsbuild.rs/guide/basic/output-files#development-mode-output
    liveReload: false,
    hmr: false,
  },
});
