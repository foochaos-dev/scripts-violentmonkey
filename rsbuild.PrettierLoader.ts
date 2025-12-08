import { type Rspack } from '@rsbuild/core';
import prettier from 'prettier';

const getParser = (path: string) => {
  if (/\.(ts|tsx)$/.test(path)) return 'typescript';
  if (/\.(js|jsx)$/.test(path)) return 'babel';
  // if (/\.(css|scss|sass)$/.test(path)) return 'lightningcss';
  return null;
};

export const PrettierLoader: Rspack.LoaderDefinition = async function (source) {
  const path = this.resourcePath;

  // Determine parser automatically (typescript/jsx/etc)
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
  use: [
    {
      loader: './rsbuild.PrettierLoader.ts',
    },
  ],
};
