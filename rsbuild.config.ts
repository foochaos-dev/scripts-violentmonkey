import { defineConfig, rspack } from '@rsbuild/core';
import { getManifest } from './manifest';
import { RuleJSTS, RuleSCSS } from './rsbuild.PrettierLoader';
import { StripBlankLinesPlugin } from './rsbuild.StripBlankLinesPlugin';
import { MinifyBookmarkletPlugin } from './rsbuild.MinifyBookmarkletPlugin';

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
      devtool: false,
      externalsType: 'umd',

      plugins: [
        StripBlankLinesPlugin(),
        MinifyBookmarkletPlugin(),
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
        emitOnErrors: true,
        mangleExports: false, // do not rename `default` to `A`, for instance
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
            // classic runtime against the @require'd global: emits `preact.h(...)`
            // instead of `(0, external_jsxRuntime_namespaceObject.jsx)(...)`
            runtime: 'classic',
            pragma: 'preact.h',
            pragmaFrag: 'preact.Fragment',
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
            drop_console: true, // strips every console.* call, warnings and errors included
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
    chunkSplit: {
      strategy: 'all-in-one',
    },
  },
  output: {
    target: 'web',
    minify: false,
    overrideBrowserslist: ['last 2 chrome version', 'last 2 firefox version'],
    module: false,
    legalComments: 'inline',
    sourceMap: false,
    filename: {
      js: '[name].user.js', // stable name, so the installed userscript can track the file
    },
    externals: {
      jspanel4: 'jsPanel',
      preact: 'window preact',
      'preact/hooks': 'window preactHooks',
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
