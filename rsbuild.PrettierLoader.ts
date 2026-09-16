import { type Rspack } from '@rsbuild/core';
import prettier from 'prettier';

const getParser = (path: string) => {
  if (/\.(ts|tsx)$/.test(path)) return 'typescript';
  if (/\.(js|jsx)$/.test(path)) return 'babel';
  // if (/\.(css|scss|sass)$/.test(path)) return 'lightningcss';
  return null;
};

// CSS is imported `?raw` and emitted as a template literal (real newlines stay readable in the bundle);
// drop comments and blank lines, indent with tabs
const cssToModule = (src: string) => {
  const css = src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/[ \t]+$/gm, '')
    .replace(/^( {2})+/gm, m => '\t'.repeat(m.length / 2))
    .replace(/\n{2,}/g, '\n')
    .trim();
  return `export default \`\n${css.replace(/[\\`]|\$\{/g, m => '\\' + m)}\n\`;\n`;
};

export const PrettierLoader: Rspack.LoaderDefinition = async function (source) {
  const path = this.resourcePath;

  // Determine parser automatically (typescript/jsx/etc)
  if (/\.css$/.test(path)) return cssToModule(source);
  const parser = getParser(path);
  if (!parser) return source; // skip non-code files

  return prettier.format(source, {
    filepath: path,
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
    useTabs: true,
    tabWidth: 2,
    parser,
  });
};

export default PrettierLoader;

export const RuleJSTS: Rspack.RuleSetRule = {
  test: /\.[jt]sx?$/,
  include: /src/,
  exclude: /node_modules/,
  enforce: 'post', // ensure prettier runs before other loaders
  use: [
    {
      loader: './rsbuild.PrettierLoader.ts',
    },
  ],
};

export const RuleSCSS: Rspack.RuleSetRule = {
  test: /\.(css|scss|sass)$/,
  include: /src/,
  exclude: /node_modules/,
  enforce: 'pre',
  type: 'javascript/auto', // override rsbuild's `?raw` asset/source: the loader emits a JS module
  use: [
    {
      loader: './rsbuild.PrettierLoader.ts',
    },
  ],
};
