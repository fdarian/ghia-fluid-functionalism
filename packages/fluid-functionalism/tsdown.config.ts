import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: { cli: 'src/cli.ts' },
	format: ['esm'],
	platform: 'node',
	dts: false,
	outDir: 'dist',
	fixedExtension: false,
});
