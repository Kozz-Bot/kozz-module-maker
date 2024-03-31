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
	mimeType: MimeType,
	stickerTags?: string[]
): Promise<Media> => {
	const b64 = await fs.readFile(filePath, 'base64');
	const fileName = null;

	return {
		data: b64,
		fileName,
		mimeType,
		sizeInBytes: Buffer.from(b64, 'base64').length,
		transportType: 'b64',
		stickerTags,
	};
};

export const createMediaFromBuffer = (
	buffer: Buffer,
	mimeType: MimeType,
	fileName?: string,
	stickerTags?: string[]
): Media => ({
	data: buffer.toString('base64'),
	fileName: fileName || null,
	mimeType: mimeType,
	sizeInBytes: buffer.length,
	transportType: 'b64',
	stickerTags,
});

export const createMediaFromB64 = (
	b64: string,
	mimeType: MimeType,
	fileName?: string,
	stickerTags?: string[]
): Media => ({
	data: b64,
	fileName: fileName || mimeType,
	mimeType: mimeType,
	sizeInBytes: Buffer.from(b64, 'base64').length,
	transportType: 'b64',
	stickerTags,
});

export const createMediaFromUrl = (
	url: string,
	mimeType: MimeType,
	fileName?: string,
	stickerTags?: string[]
): Media => ({
	data: url,
	fileName: fileName || mimeType,
	mimeType: mimeType,
	sizeInBytes: null,
	transportType: 'url',
	stickerTags,
});
