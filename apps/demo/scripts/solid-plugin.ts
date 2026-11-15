import { readFile } from 'node:fs/promises';
import { transformAsync } from '@babel/core';
import presetTypescript from '@babel/preset-typescript';
import presetSolid from 'babel-preset-solid';
import { type BunPlugin, plugin } from 'bun';

/**
 * The Solid compile for `bun scripts/x.tsx` and `Bun.build`. @ghia/solid 0.12 removed its own Bun plugin
 * (apps run under `ghia dev` and Vite), and the check, perf and footprint scripts here are plain Bun
 * processes with a registry plugin, so the same universal compile lives here.
 */
const STATE = Symbol.for('ghia-fluid-functionalism/solid-plugin');

function stripQuery(path: string) {
	return path.split(/[?#]/, 1)[0];
}

export const solidPlugin: BunPlugin = {
	name: 'solid',
	setup(build) {
		// solid-js resolves to its server build under Bun's conditions; the client build is the one with a reactive graph.
		build.onLoad(
			{
				filter:
					/[/\\]node_modules[/\\]solid-js[/\\]dist[/\\]server\.js(?:[?#].*)?$/,
			},
			async (args) => ({
				contents: await readFile(
					stripQuery(args.path).replace('server.js', 'solid.js'),
					'utf8',
				),
				loader: 'js',
			}),
		);
		build.onLoad(
			{
				filter:
					/[/\\]node_modules[/\\]solid-js[/\\]store[/\\]dist[/\\]server\.js(?:[?#].*)?$/,
			},
			async (args) => ({
				contents: await readFile(
					stripQuery(args.path).replace('server.js', 'store.js'),
					'utf8',
				),
				loader: 'js',
			}),
		);
		build.onLoad(
			{ filter: /^(?!.*[/\\]node_modules[/\\]).*\.[cm]?[jt]sx(?:[?#].*)?$/ },
			async (args) => {
				const filename = stripQuery(args.path);
				const result = await transformAsync(await readFile(filename, 'utf8'), {
					filename,
					configFile: false,
					babelrc: false,
					presets: [
						[presetSolid, { generate: 'universal', moduleName: '@ghia/solid' }],
						[presetTypescript],
					],
				});
				if (result?.code == null) {
					throw new Error(`Babel produced no code for ${filename}`);
				}
				return { contents: result.code, loader: 'js' };
			},
		);
	},
};

export function ensureSolidPlugin() {
	const state: Record<symbol, boolean> = globalThis;
	if (state[STATE]) return;
	plugin(solidPlugin);
	state[STATE] = true;
}
