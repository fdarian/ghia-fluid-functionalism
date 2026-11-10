# ghia-fluid-functionalism

[Fluid Functionalism](https://fluidfunctionalism.com)'s components, demos and pages drawn natively on
[ghia](https://github.com/fdarian/ghia) (Solid on GPUI), with no DOM and no CSS engine.

```sh
npx ghia-fluid-functionalism
```

Apple Silicon macOS only. The first run downloads the app (about 56 MB) from the GitHub Release, checks its sha256 and
caches it under `~/Library/Caches/ghia-fluid-functionalism/`; later runs start from the cache.
`GHIA_FLUID_FUNCTIONALISM_BINARY_PATH` runs a binary you built yourself instead.

The components themselves are not published yet. Source, drift from the upstream site and how to run the app from a
checkout: [fdarian/ghia-fluid-functionalism](https://github.com/fdarian/ghia-fluid-functionalism).
