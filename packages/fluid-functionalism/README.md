# ghia-fluid-functionalism

[Fluid Functionalism](https://fluidfunctionalism.com)'s components, demos and pages drawn natively on
[ghia](https://github.com/fdarian/ghia) (Solid on GPUI), with no DOM and no CSS engine.

```sh
npx ghia-fluid-functionalism
```

Apple Silicon macOS only. The first run downloads the app (about 56 MB) from the GitHub Release, checks its sha256 and
caches it under `~/Library/Caches/ghia-fluid-functionalism/`; later runs start from the cache.
`GHIA_FLUID_FUNCTIONALISM_BINARY_PATH` runs a binary you built yourself instead.

## Use as a library

The styled Solid components install from npm, with `@ghia/solid` and `solid-js` as peers (exact versions, one copy of each
in your app):

```sh
pnpm add ghia-fluid-functionalism @ghia/solid@0.11.1 solid-js@1.9.15
```

```ts
import { Button } from 'ghia-fluid-functionalism/button';
import { color } from 'ghia-fluid-functionalism/theme';
```

Every component is a subpath (`/card`, `/tooltip`, `/sidebar`, ...), next to `/theme`, `/icon` and `/icons`. They render
through `@ghia/solid` (gpuix, not the DOM), so the app also needs `@ghia/native@0.11.1`, whose addon is macOS on Apple Silicon.

Source, drift from the upstream site and how to run the app from a checkout:
[fdarian/ghia-fluid-functionalism](https://github.com/fdarian/ghia-fluid-functionalism).
