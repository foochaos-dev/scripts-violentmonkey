import { type Rspack } from '@rsbuild/core';
import path from 'node:path';
import fs from 'node:fs/promises';
import { minify } from 'terser';

const SOURCE = path.join(process.cwd(), 'src/betterbw/bookmarklet/bookmarklet.js');
const OUTPUT = 'bookmarklet.min.js';

/**
 * The bookmarklet (`bookmarklet.js`) isn't bundled: it has no imports and needs none of the userscript's
 * `BannerPlugin` header. It only needs minifying into a single `javascript:` line short enough for a
 * bookmark's URL field, so that's done directly against the source file rather than through an entry.
 */
export function MinifyBookmarkletPlugin(): Rspack.Plugin {
  return (compiler: Rspack.Compiler) => {
    compiler.hooks.done.tapPromise('MinifyBookmarkletPlugin', async () => {
      try {
        // `output.path` is `dist`; the JS assets land in `dist/static/js` (rsbuild's default `js` sub-directory).
        const outPath = path.join(compiler.options?.output?.path || process.cwd(), 'static/js');
        const src = await fs.readFile(SOURCE, 'utf8');
        // `#` escaped: some browsers cut a bookmark URL at it, as if it started a fragment.
        const { code } = await minify(src, { compress: true, mangle: true, format: { comments: false } });
        await fs.writeFile(path.join(outPath, OUTPUT), `javascript:${code?.replace(/#/g, '%23')}`, 'utf8');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[MinifyBookmarkletPlugin] failed', err);
      }
    });
  };
}
