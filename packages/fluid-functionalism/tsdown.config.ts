import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import solid from 'rolldown-plugin-solid';
import { defineConfig } from 'tsdown';

const root = dirname(fileURLToPath(import.meta.url));

// One entry per `exports` key, so a new component or export needs no config edit.
// Output keeps the source layout (`components/button`, `lib/theme`), which is what
// `publishConfig.exports` points at.
const exportsMap: Record<string, string> = JSON.parse(
	readFileSync(join(root, 'package.json'), 'utf8'),
).exports;

const libraryEntries: Record<string, string> = {};
for (const target of Object.values(exportsMap)) {
	const wildcard = target.indexOf('*');
	if (wildcard === -1) {
		libraryEntries[target.replace(/^\.\/src\//, '').replace(/\.tsx?$/, '')] =
			join(root, target);
		continue;
	}
	const directory = target.slice(0, target.lastIndexOf('/', wildcard));
	const extension = target.slice(wildcard + 1);
	for (const file of readdirSync(join(root, directory))) {
		if (!file.endsWith(extension)) continue;
		const name = file.slice(0, -extension.length);
		libraryEntries[`${directory.replace(/^\.\/src\//, '')}/${name}`] = join(
			root,
			directory,
			file,
		);
	}
}

export default defineConfig([
	{
		cwd: root,
		entry: libraryEntries,
		format: ['esm'],
		dts: true,
		// The two configs build in parallel into one dir: this one must not wipe cli.js.
		clean: ['dist/**', '!dist/cli.js'],
		outDir: 'dist',
		fixedExtension: false,
		// Consumers install these once; bundling a copy would give a second reactive graph or renderer.
		deps: { neverBundle: [/^@ghia\//, /^ghia-base-ui/, /^solid-js/] },
		// Same compile as @ghia/solid/bun-plugin: universal output importing from @ghia/solid, never solid-js/web.
		plugins: [
			solid({ solid: { generate: 'universal', moduleName: '@ghia/solid' } }),
		],
	},
	{
		cwd: root,
		entry: { cli: join(root, 'src/cli.ts') },
		format: ['esm'],
		platform: 'node',
		dts: false,
		clean: false,
		outDir: 'dist',
		fixedExtension: false,
	},
]);
