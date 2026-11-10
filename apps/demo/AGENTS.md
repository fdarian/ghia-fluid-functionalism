`ghia-fluid-functionalism-demo`: the native-window app that shows every component, demo and page of the source site, plus the scripts that check, capture and measure it. Private, never published; `release:binary` compiles it into the signed darwin-arm64 binary that `npx ghia-fluid-functionalism` downloads from the GitHub Release. The components come from the library [`packages/fluid-functionalism`](../../packages/fluid-functionalism/AGENTS.md); the workspace rules are in the [root AGENTS.md](../../AGENTS.md).

Run every `bun` script from this directory: `bunfig.toml` here holds the Solid transform and the registry preload, and Bun reads it from the working directory. The root `pnpm` scripts do that for you.

## Layout

- `src/demos/` — one file per component page (`title`, `group`, `Demo`, optional `scenarios` for screenshots); `src/lib/demo.ts` reads them through the `virtual:demos` module. `src/demos/sidebar/` holds the sidebar demo's pieces.
- `src/pages/`, `src/home/` — the site's own pages (Introduction, Changelog, the System pages, Compare, Concepts, Audio Mixer) and the home bento grid; `src/app.tsx` is the shell and sidebar, `src/main.tsx` the entry (`pnpm start`).
- `src/lib/` — demo-side shared code: `demo.ts` (the demo and page contracts), `demo-kit.tsx`, `doc-page.tsx`, `playground.tsx`, `app-frame.tsx`, `site-command-menu.tsx`, `page-nav.ts`, `theme-fade.tsx`, `fonts.ts`, `assets.ts`, `changelog/`, `perf.ts`. The theme, fluid hover, popup and the rest come from the library; the table is in README under "Shared code".
- `scripts/` — `check-*.tsx` scenario checks (each runnable alone with `bun scripts/check-x.tsx`), `check-kit.tsx` (their harness), `run-scenarios.ts` and `run-screenshots.ts` (the runners), `screenshots.tsx`, `perf*.tsx` and `footprint*.tsx`, `build.ts` and `release-binary.ts` (compile), `registry-plugin.ts` / `registry-preload.ts` (the `virtual:*` modules), `drift-counts.ts` (prints README's drift table).
- `screenshots/`, `content/changelog/`, `assets/` — captures per page, the verbatim upstream changelog, fonts and images. `perf/` is where `pnpm perf` and `pnpm footprint` write; results are not committed.
- `packager.json` — `cargo packager` config for `bundle/Fluid Functionalism.app`.

## Commands

- `pnpm start` (root) runs `bun --hot src/main.tsx`; `pnpm check:type` is `tsc` over `src/` and `scripts/`.
- `pnpm check:scenarios` takes about 30 minutes, so run `bun scripts/check-<component>.tsx` for the component you touched and `pnpm check` before merging. `check-single-instance.ts` is among them and also runs alone as `pnpm --filter ghia-fluid-functionalism-demo check:single-instance`.
- `pnpm screenshots [slug]` — one page, or about 25 minutes for all of them.
- `pnpm perf [slug...] --label x` — live frame times on the real window into `perf/<label>.json` (README, "Harness and shared-lib notes").
- `pnpm footprint [slug...] --label x` — idle CPU and memory per page in a fresh compiled child, headless; `--window` for a real window, `--tour` for what a session leaves behind; results land in `perf/`.
- `pnpm build` — `dist/fluid-functionalism` (Bun compile) and `bundle/Fluid Functionalism.app`; needs `cargo install cargo-packager --locked` (README, "Build the app").
- `release:binary` — the release tarball in `dist/releases/` and its sha256 in the library's `dist/checksums.json`; part of `ci:release` after the library `build`, run it only in CI.

## Conventions

- Imports inside the app are `#src/<path>.ts` with the extension; a library file is imported by its public subpath, `ghia-fluid-functionalism/<name>` (`button`, `theme`, `fluid-hover`, ...). The library's `exports` is the whole surface: a file it does not export is not importable here.
- A new demo is `src/demos/<name>.tsx` and nothing else: demos, pages and the changelog are found through the `virtual:*` modules of `scripts/registry-plugin.ts`. Its export lists (`DEMO_EXPORTS`, `PAGE_EXPORTS`) must stay in step with `src/lib/demo.ts`.
- The compiled binary reads nothing from the repo. A runtime asset is an embedded import (`with { type: 'file' }`); an image `src` goes through `diskPath` in `src/lib/assets.ts`, because gpuix's Rust loader cannot read `$bunfs`. Never build a path from `import.meta.url` or `import.meta.dir`, or scan a directory at runtime.
- Screenshot diffs are noisy: playground variants use `Math.random`, and the caret and timing demos vary run to run. Compare the content area by pixels, not hashes, and do not recommit `screenshots/` for noise.
- Keep one copy of `ghia-base-ui`, `@ghia/solid` and `solid-js`: `check-single-instance.ts` fails when any resolves to a second copy from the demo or from the library, so pin the same versions in both `package.json` files.

## Notes

- [Verification](../../.agents/notes/verification.md) — check and screenshot traps (still bounds, fractional content, noisy captures); read before writing a `scripts/check-*.tsx`
- [Performance](../../.agents/notes/performance.md) — culling, scroll-write and page-switch decisions, and the protocols behind `pnpm perf` / `pnpm footprint`
- [Tooling and build](../../.agents/notes/tooling-and-build.md) — compile flags, registry plugin, why `noUncheckedIndexedAccess` and Biome a11y are off
