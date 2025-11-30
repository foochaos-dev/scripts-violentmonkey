import { defineConfig } from '@rsbuild/core';

const isDev = process.env.NODE_ENV !== 'development';

export default defineConfig({
  mode: 'production', // concatenate modules even on `rsbuild watch`
  tools: {
    htmlPlugin: false,
    rspack: {
      externals: {
        jspanel4: 'jsPanel',
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
    removeConsole: ['log'],
  },
  output: {
    target: 'web',
    minify: false,
    module: false,
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
