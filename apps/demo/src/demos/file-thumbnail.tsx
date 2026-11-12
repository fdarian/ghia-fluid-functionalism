import {
	type FileLike,
	FileThumbnail,
} from 'ghia-fluid-functionalism/file-thumbnail';
import { For } from 'solid-js';
import { AVATAR_JPG } from '#src/lib/assets.ts';
import type { DemoModule } from '#src/lib/demo.ts';
import { DemoCard, DemoRow } from '#src/lib/demo-kit.tsx';

const photo: FileLike = {
	name: 'avatar.jpg',
	type: 'image/jpeg',
	src: AVATAR_JPG,
};
const pdf: FileLike = { name: 'design-notes.pdf', type: 'application/pdf' };
const SIZES = [28, 48, 64, 96];

export const title = 'FileThumbnail';
export const group = 'Components';
export const listed = 'menu';

export function Demo() {
	return (
		<DemoCard title="File Thumbnail">
			<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
				<DemoRow label="Image">
					<For each={SIZES}>
						{(size) => <FileThumbnail file={photo} size={size} />}
					</For>
				</DemoRow>
				<DemoRow label="No preview">
					<For each={SIZES}>
						{(size) => <FileThumbnail file={pdf} size={size} />}
					</For>
				</DemoRow>
				<DemoRow label="Pending">
					<FileThumbnail file={pdf} size={64} pending />
					<FileThumbnail file={photo} size={64} pending />
				</DemoRow>
				<DemoRow label="Radius">
					<FileThumbnail file={photo} size={64} radius={4} />
					<FileThumbnail file={photo} size={64} radius={16} />
					<FileThumbnail file={photo} size={64} radius={32} />
				</DemoRow>
			</div>
		</DemoCard>
	);
}

export const scenarios: DemoModule['scenarios'] = async (shot) => {
	// The spinner arc turns natively: two frames show it moved.
	await shot.settle(250);
	shot.capture('pending-a');
	await shot.settle(310);
	shot.capture('pending-b');
};
