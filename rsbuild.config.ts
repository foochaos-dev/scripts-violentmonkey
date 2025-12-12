import { defineConfig, rspack } from '@rsbuild/core';
import { getManifest } from './manifest';
import { PrettierPlugin } from './rsbuild.PrettierPlugin';
import { RuleJSTS, RuleSCSS } from './rsbuild.PrettierLoader';
import { StripBlankLinesPlugin } from './rsbuild.StripBlankLinesPlugin';

const isDev = process.env.NODE_ENV !== 'development';

export default defineConfig({
  mode: 'production', // concatenate modules even on `rsbuild watch`
  tools: {
    htmlPlugin: false,
    lightningcssLoader: {
      minify: false,
      exclude: {
        // exclude from processing; what you'd like to keep untouched;
        nesting: true,
      },
    },
    rspack: {
      externalsType: 'umd',

      plugins: [
        // PrettierPlugin(),
        StripBlankLinesPlugin(),
        new rspack.BannerPlugin({
          banner: getManifest(),
          raw: true, // false = wraps into a comment
          entryOnly: true,
        }),
      ],
      module: {
        rules: [RuleJSTS, RuleSCSS],
      },
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
      module: {
        type: 'es6',
      },
      isModule: 'unknown',
      jsc: {
        externalHelpers: true,
        transform: {
          react: {
            runtime: 'automatic',
            importSource: 'preact',
            // pragma: 'h',
            // pragmaFrag: 'Fragment',
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
            inline: 1,
            passes: 4,
            keep_fnames: true,
            keep_classnames: true,
          },
          mangle: false,
          module: true,
          keep_fnames: true,
          keep_classnames: true,
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
    module: false,
    legalComments: 'inline',
    filename: {
      js: isDev ? '[name].user.js' : '[name].[contenthash:8].user.js',
    },
    externals: {
      jspanel4: 'jsPanel',
      preact: 'window preact',
      'preact/hooks': 'window preactHooks',
      'preact/jsx-runtime': 'window jsxRuntime',
      // preact: './external-preact.js',
      // preact: 'https://cdn.jsdelivr.net/npm/preact/+esm',
      // preact: '(await import("https://cdn.jsdelivr.net/npm/preact/+esm"))',
    },
  },

  dev: {
    writeToDisk: true, // https://rsbuild.rs/guide/basic/output-files#development-mode-output
    liveReload: false,
    hmr: false,
  },
});
