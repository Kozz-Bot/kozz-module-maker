import { Command, Media } from 'kozz-types/dist';
import { Socket } from 'socket.io-client';
import { replyWithMedia } from '../../../Message/PayloadCreation';
import {
	MimeType,
	loadMediaFromPath,
	createMediaFromBuffer,
	createMediaFromB64,
} from '../../../Message/PayloadCreation/Media';

export const withMedia = (socket: Socket, command: Command) => {
	/**
	 * Replies with a media
	 * @param {Media} media
	 * @param {string} caption
	 */
	const replyMedia = (media: Media, caption?: string) => {
		socket.emit('reply_with_media', replyWithMedia(command, media, caption));
	};

	replyMedia.fromPath = async (
		path: string,
		mimeType: MimeType,
		caption?: string
	) => {
		const media = await loadMediaFromPath(path, mimeType);
		replyMedia(media, caption);
	};

	replyMedia.fromBuffer = (
		buffer: Buffer,
		mimeType: MimeType,
		caption?: string,
		fileName?: string
	) => {
		const media = createMediaFromBuffer(buffer, mimeType, fileName);
		replyMedia(media, caption);
	};

	replyMedia.fromB64 = (
		b64: string,
		mimeType: MimeType,
		caption?: string,
		fileName?: string
	) => {
		const media = createMediaFromB64(b64, mimeType, fileName);
		replyMedia(media, caption);
	};

	return replyMedia;
};
