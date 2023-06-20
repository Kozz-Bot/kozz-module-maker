import { Media, Command } from 'kozz-types/dist';
import { Socket } from 'socket.io-client';
import { replyWithSticker } from '../../PayloadCreation';

export const withSticker =
	(socket: Socket, command: Command) => (media: Media) => {
		socket.emit('reply_with_sticker', replyWithSticker(command, media));
	};
