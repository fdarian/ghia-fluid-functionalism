`ghia-fluid-functionalism`: the ported Fluid Functionalism components and the styling code they share (tokens, springs, fluid hover, popup chrome), as Solid on `@ghia/solid`. In the workspace `exports` point at TS source and the demo imports them as `ghia-fluid-functionalism/<name>`. What npm ships today is only the `npx` shim (`src/cli.ts`, built to `dist/cli.js`): it downloads, verifies and runs the darwin-arm64 app binary from the GitHub Release, and imports nothing from the rest of the package. The app itself is [`apps/demo`](../../apps/demo/AGENTS.md); the workspace rules are in the [root AGENTS.md](../../AGENTS.md).

## Layout

- `src/components/<name>.tsx` — one file per component, styled with tokens from `src/lib/theme.ts`; each consumes its `ghia-base-ui` primitive where Base UI has one. Shared parts (`choice-group`, `menu-item`, `dropdown-search`, `color-picker-math.ts`) sit beside them.
- `src/lib/` — shared code: `theme.ts` (tokens, springs, shadows), `fluid-hover.ts` / `fluid-highlight.tsx`, `focus-ring.tsx`, `popup.tsx` and `popup-timing.ts`, `press.tsx`, `stable-label.tsx`, `measured-height.ts`, `cull.ts`, `icon.tsx`, `icons.ts` and `icons/`, `platform.ts`, `offset.ts`, `preview-pill.ts`, `surface-context.ts`. The table is in README under "Shared code".
- `src/cli.ts` — the npx shim. `tsdown.config.ts` builds it (and only it) to `dist/cli.js`; `dist/checksums.json` is written by the demo's `release:binary`.
- `package.json` `files` lists `dist/cli.js`, `dist/checksums.json`, `README.md`, `LICENSE` and `THIRD_PARTY_NOTICES.md`; `README.md` here is the npm page (npx usage, platform, the `GHIA_FLUID_FUNCTIONALISM_BINARY_PATH` override), and the repo README is the project overview. Everything the components need is a devDependency, because npx installs only the shim.

## Conventions

- Imports inside the package are `#src/<path>.ts` (alias `#src/*` in `package.json` `imports`), with the file extension; the `tsconfig` allows it.
- `exports` is `./*` for `src/components/*.tsx`, plus a named entry per public lib file (`./theme`, `./icon`, `./icons`, `./icons/*`, `./fluid-hover`, `./fluid-highlight`, `./stable-label`, `./measured-height`, `./cull`, `./platform`) and `./color-picker-math`. A new component needs no export edit; a lib file the demo needs does. Nothing else is public, so a demo importing another lib file is a missing export.
- A behaviour change (keys, selection, ARIA, open state, typeahead, presence) goes into the `ghia-base-ui` primitive, not into a component here. Components keep the look: tokens, springs, popup chrome, focus ring, fluid hover. Details in [Base UI seam](../../.agents/notes/base-ui-seam.md).
- Every place a component differs from the source gets an entry in `drift/<name>.md` at the repo root, with its Cause. gpuix cannot do some things (transforms the source uses, `:has(.x)`): record the approximation and link the README gap row.
- `no-dom` TypeScript lib (`types: [bun]`): DOM types in this source break the program.

## Notes

- [Motion and fluid hover](../../.agents/notes/motion-and-fluid-hover.md) — read before touching `src/lib/fluid-hover.ts` or a component's motion
- [Fonts and theme](../../.agents/notes/fonts-and-theme.md) — weight tokens, `StableLabel`, theme cross-fade
- [Base UI seam](../../.agents/notes/base-ui-seam.md) — moving behaviour between a component and a primitive
