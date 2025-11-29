import type { Config } from 'prettier';

/**
 * @see https://prettier.io/docs/configuration
 */
const config: Config = {
  experimentalTernaries: false,
  experimentalOperatorPosition: 'start',
  printWidth: 140,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',

  trailingComma: 'es5',
  bracketSpacing: true,
  objectWrap: 'preserve',
  bracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  embeddedLanguageFormatting: 'auto',
  singleAttributePerLine: false,
};

export default config;
