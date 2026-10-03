# Better BW – agent instructions

## Changelog

Every change made under `src/betterbw/` must be registered in [CHANGELOG.md](CHANGELOG.md), in the same session as the change. Follow the existing format (Keep a Changelog: `Added`, `Changed`, `Fixed`, `Internal`), and write entries from the user's point of view.

## Version

The version number comes from [manifest.ts](../../manifest.ts) (the `version` default in `getManifest`). Never invent one or take it from the changelog.

Before any build, and before touching the changelog, check whether the version is "dirty":

1. Compare the version in `manifest.ts` with the one in the previous commit (`git show HEAD:manifest.ts`).
2. **Different** → it's dirty (already bumped for the work in progress). Use it as is.
3. **Same** → it isn't dirty. Bump the **minor** version in `manifest.ts` first (e.g. `1.9.1` → `1.10.0`, patch reset to `0`), then continue.

Only then build and write the changelog entry, under a heading matching the `manifest.ts` version (`## [x.y.z] - YYYY-MM-DD`). If that version's section already exists (dirty version), add to it instead of creating a new one.
