import { Command, Media } from 'kozz-types';
import { Socket } from 'socket.io-client';
import {
	replyWithText,
	replyWithSticker,
	replyWithMedia,
} from './PayloadCreation';

export type MessageObj = ReturnType<typeof createMessageObject>;

export const createMessageObject = (socket: Socket, command: Command) => {
	const reply = (text: string) => {
		socket.emit('reply_with_text', replyWithText(command, text));
	};

	const replySticker = (media: Media) => {
		socket.emit('reply_with_sticker', replyWithSticker(command, media));
	};

	const replyMedia = (media: Media, caption?: string) => {
		socket.emit('reply_with_media', replyWithMedia(command, media, caption));
	};

	return {
		rawCommand: command,
		media: command.message.media,
		quotedMessage: command.message.quotedMessage,
		body: command.message.body,
		type: command.message.messageType,
		isViewOnce: command.message.isViewOnce,
		reply: {
			withText: reply,
			withSticker: replySticker,
			withMedia: replyMedia,
		},
	};
};
