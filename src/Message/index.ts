import { Command, Media } from 'kozz-types';
import { Socket } from 'socket.io-client';
import { replyWithText, replyWithSticker } from './PayloadCreation';

export type MessageObj = ReturnType<typeof createMessageObject>;

export const createMessageObject = (socket: Socket, command: Command) => {
	const reply = (text: string) => {
		socket.emit('reply_with_text', replyWithText(command, text));
	};
	const replySticker = (media: Media) => {
		socket.emit('reply_with_sticker', replyWithSticker(command, media));
	};

	return {
		rawCommand: command,
		media: command.message.media,
		quotedMessage: command.message.quotedMessage,
		body: command.message.body,
		reply: {
			withText: reply,
			withSticker: replySticker,
		},
	};
};
