import fs from 'fs/promises';
import { Media } from 'kozz-types';

export type MimeType =
	| 'video/mp4'
	| 'image/gif'
	| 'image'
	| 'video'
	| 'video/mpeg'
	| 'audio/webm';

export const loadMediaFromPath = async (
	filePath: string,
	mimeType: MimeType
): Promise<Media> => {
	const b64 = await fs.readFile(filePath, 'base64');
	const fileName = null;

	return {
		data: b64,
		fileName,
		mimeType,
		sizeInBytes: Buffer.from(b64, 'base64').length,
	};
};

export const createMediaFromBuffer = (
	buffer: Buffer,
	mimeType: MimeType,
	fileName?: string
): Media => ({
	data: buffer.toString('base64'),
	fileName: fileName || null,
	mimeType: mimeType,
	sizeInBytes: buffer.length,
});

export const createMediaFromB64 = (
	b64: string,
	mimeType: MimeType,
	fileName?: string
): Media => ({
	data: b64,
	fileName: fileName || null,
	mimeType: mimeType,
	sizeInBytes: Buffer.from(b64, 'base64').length,
});
