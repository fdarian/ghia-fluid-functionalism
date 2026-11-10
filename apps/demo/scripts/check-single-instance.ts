import { realpathSync } from 'node:fs';
import { dirname } from 'node:path';

/**
 * One runtime instance of solid-js, @ghia/solid and ghia-base-ui across the
 * demo, packages/fluid-functionalism and ghia-base-ui: a second copy of any
 * gives a second reactive graph or renderer registry, and nothing fails
 * loudly. ghia-base-ui peer-depends on solid-js and @ghia/solid, so a version
 * range in either workspace package that it does not accept installs a second copy.
 */
const root = realpathSync(`${import.meta.dir}/..`);
const library = realpathSync(`${root}/node_modules/ghia-fluid-functionalism`);
const baseUi = realpathSync(`${library}/node_modules/ghia-base-ui`);
const gpuixSolid = dirname(
	realpathSync(Bun.resolveSync('@ghia/solid/package.json', root)),
);

const importers = [
	['demo', root],
	['ghia-fluid-functionalism', library],
	['ghia-base-ui', baseUi],
	['@ghia/solid', gpuixSolid],
] as const;
// ghia-base-ui and @ghia/solid do not import ghia-base-ui.
const notImportedBy: Record<string, string[]> = {
	'ghia-base-ui': ['ghia-base-ui', '@ghia/solid'],
};

let failed = false;
for (const specifier of ['solid-js', '@ghia/solid', 'ghia-base-ui']) {
	const resolved = new Map<string, string[]>();
	for (const importer of importers) {
		const name = importer[0];
		if (notImportedBy[specifier]?.includes(name)) continue;
		const file = realpathSync(Bun.resolveSync(specifier, importer[1]));
		resolved.set(file, [...(resolved.get(file) ?? []), name]);
	}
	for (const [file, names] of resolved)
		console.log(specifier, names.join(', '), file);
	if (resolved.size !== 1) {
		failed = true;
		console.error(`${specifier}: ${resolved.size} instances`);
	}
}
if (failed) process.exit(1);
console.log(
	'check-single-instance: one instance of solid-js, @ghia/solid and ghia-base-ui',
);
