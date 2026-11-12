/**
 * Compiles the app into the darwin-arm64 release tarball in `dist/releases/`
 * and writes its sha256 to the library package's `dist/checksums.json`, which
 * the npx shim checks after downloading it. Run after the library build: that
 * build owns `packages/fluid-functionalism/dist`.
 */
import { mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { compileApp } from './compile-app';

const NAME = 'ghia-fluid-functionalism';
const TARGET = 'darwin-arm64';

const root = join(import.meta.dir, '..');
const dist = join(root, 'dist');
const binDir = join(dist, 'bin');
const releasesDir = join(dist, 'releases');
const tarball = join(releasesDir, `${NAME}-${TARGET}.tar.gz`);
const checksums = resolve(
	root,
	'../../packages/fluid-functionalism/dist/checksums.json',
);

function run(command: string[]) {
	const result = Bun.spawnSync(command, {
		stdout: 'inherit',
		stderr: 'inherit',
	});
	if (result.exitCode !== 0) {
		throw new Error(`${command.join(' ')} exited ${result.exitCode}`);
	}
}

await compileApp(join(binDir, NAME));

// Bun's own signature is not trusted on Apple Silicon: re-sign before tarring.
run(['codesign', '--force', '--sign', '-', join(binDir, NAME)]);

run(['mkdir', '-p', releasesDir]);
run(['tar', '-czf', tarball, '-C', binDir, NAME]);

const hasher = new Bun.CryptoHasher('sha256');
hasher.update(await Bun.file(tarball).arrayBuffer());
mkdirSync(dirname(checksums), { recursive: true });
await Bun.write(
	checksums,
	`${JSON.stringify({ [TARGET]: hasher.digest('hex') }, null, '\t')}\n`,
);
console.log(`${tarball}\n${checksums}`);
