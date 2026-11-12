Solid workspace that draws the [Fluid Functionalism](https://fluidfunctionalism.com) component library on [gpuix](https://github.com/remorses/gpuix), a GPUI-backed renderer with no DOM and no CSS engine: every component, demo and page of the source site, with its fluid hover, springs and keyboard behaviour. It is a port, so most work is closing or recording a difference from the source. [README.md](README.md) is the overview (run it, add a component, the gpuix gaps and bugs, the drift table); [UPSTREAM.md](UPSTREAM.md) says which upstream commit each file tracks and how to sync. pnpm workspace, Biome, turbo for checks only.

## Layout

- [`packages/fluid-functionalism/`](packages/fluid-functionalism/AGENTS.md) — the library, `ghia-fluid-functionalism` on npm: the ported components, the styling tokens and the fluid hover. Workspace consumers import its TS source; the published package only ships the `npx` shim.
- [`apps/demo/`](apps/demo/AGENTS.md) — private native-window app with every demo and page of the source site, plus the check, screenshot and perf scripts. `release:binary` compiles it into the binary the shim downloads.
- `drift/` — one markdown file per component or page listing every place the port differs from the source, with a Cause. [`drift/_TEMPLATE.md`](drift/_TEMPLATE.md) is the shape; README's table counts the entries.
- `UPSTREAM.md`, `.changeset/`, `.github/`, `biome.jsonc`, `turbo.jsonc` — upstream pins and the sync procedure, release notes, CI, lint and task config.

## Stack

- Solid JSX on `@ghia/solid` and `@ghia/native` from npm (source and docs: [fdarian/ghia](https://github.com/fdarian/ghia); `docs/reference.md` is the API, `docs/fork/` says where it differs from the DOM; refs into them read `ghia:docs/<path>:lines`, read at `730f77f1`). Elements are gpuix's (`<div>`, `<text>`, `<anchored>`, `motion.*`) with style objects, not HTML and CSS classes.
- Bun runs everything, with the Solid transform and the demo/page/changelog registry as preloads (`apps/demo/bunfig.toml`): no build step to develop. pnpm 12 installs, TypeScript 7 (`tsc`), Biome (tabs, single quotes). Each package has its own `#src/*` import alias, with the file extension (`#src/lib/theme.ts`).
- Behaviour primitives (keys, selection, open state, focus, ARIA) come from `ghia-base-ui` on npm (source: [fdarian/ghia-base-ui](https://github.com/fdarian/ghia-base-ui); `base-ui:` paths are in that repo). This repo keeps styling, springs and fluid hover.

## Commands

All from the repo root; the demo scripts are forwarded to `apps/demo`, so `bun` scripts and `bunfig.toml` live there ([its AGENTS.md](apps/demo/AGENTS.md)).

- `pnpm install` — from the root only. `pnpm start` runs the app; `pnpm check:type` is `tsc` in both packages; `pnpm check` is `check:type` then `check:scenarios` (turbo).
- `pnpm check:scenarios` takes about 30 minutes, so run `cd apps/demo && bun scripts/check-<component>.tsx` for the component you touched and `pnpm check` before merging.
- `pnpm screenshots [slug]`, `pnpm perf [slug...] --label x`, `pnpm footprint [slug...] --label x`, `pnpm build` — forwarded to the demo.
- `pnpm format` — Biome.
- `pnpm changeset` — describe a change; merging the Version Packages PR runs `.github/workflows/release.yml`. `ci:release` (library `build`, demo `release:binary`, then `changeset publish`) writes `packages/fluid-functionalism/dist/cli.js` and `dist/checksums.json` and `apps/demo/dist/releases/*.tar.gz`; run it only in CI. `ci.yml` runs `check:single-instance` in the demo.

## Rules

- `@ghia/solid`, `@ghia/native` and `ghia-base-ui` are pinned to exact versions, the same in each `package.json` that lists them. `ghia-base-ui` peer-depends on `@ghia/solid` and `solid-js`; a second copy of either gives two renderers or reactive graphs and silent breakage. `apps/demo/scripts/check-single-instance.ts` catches it for the demo and for the library.
- A behaviour change (keys, selection, ARIA, open state, typeahead, presence) goes into the primitive in `ghia-base-ui`, not into a component here (release it, then bump the pins). A look change (tokens, motion, fluid hover) stays here. Its `BASE-UI-AUDIT.md` (in the repo, not the npm package) records where the primitives differ from Base UI.
- A component adds `packages/fluid-functionalism/src/components/<name>.tsx`, `apps/demo/src/demos/<name>.tsx` and `drift/<name>.md` and edits no shared file: the library's `./*` export covers the new component, and the demo finds its demo file by itself. Whenever code the drift file cites moves, its `file:line` refs move with it. Refs are repo-root-relative (`packages/fluid-functionalism/src/components/button.tsx:307-308`); refs into the primitives read `base-ui:src/<path>:lines`.
- gpuix cannot do some things the source does (selector `:has(.x)` and group-has, `var()` in a Motion key, a `layoutId` crossfade). Record the approximation in the drift file and link the README gap row; do not paper over it.
- Source filenames are kebab-case.

## Notes

Open on demand; each says what it covers first. They span both packages, so they live here.
- [Product and owner decisions](./.agents/notes/product.md) — what question the port answers, the four standing decisions from 2026-10-16, what is deliberately not shipped (icons, sample photo); read before reopening scope
- [Motion and fluid hover](./.agents/notes/motion-and-fluid-hover.md) — springs, exits, native hover, press-shrink, the fluid-hover rules (integer rows, container-pixel reads, batched reads), native animation loops; read before touching `packages/fluid-functionalism/src/lib/fluid-hover.ts` or a component's motion
- [Transforms and layout glides](./.agents/notes/transforms-and-layout-glides.md) — where the source's transforms are used, the traps (measurements under a transform, glides only at a commit, `Unsteady` layout boxes), remaining approximations
- [Fonts and theme](./.agents/notes/fonts-and-theme.md) — variable-font weight tokens, why `StableLabel` keeps two ghosts, the theme cross-fade layer
- [Performance](./.agents/notes/performance.md) — culling, scroll-write and page-switch decisions, and the protocols that make `pnpm perf` / `pnpm footprint` / check budgets trustworthy
- [Verification](./.agents/notes/verification.md) — check and screenshot traps (still bounds, fractional content, noisy captures)
- [Tooling and build](./.agents/notes/tooling-and-build.md) — compile flags, registry plugin, drift causes, why `noUncheckedIndexedAccess` and Biome a11y are off
- [Base UI seam](./.agents/notes/base-ui-seam.md) — controllable highlight, refs, `tabIndex` mechanics when moving behaviour between a component and a `ghia-base-ui` primitive
