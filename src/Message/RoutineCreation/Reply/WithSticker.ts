import { Media, Command, MessageReceivedByGateway } from 'kozz-types/dist';
import { Socket } from 'socket.io-client';
import { replyWithSticker } from '../../PayloadCreation';

export const withSticker =
	(socket: Socket, messagePayload: MessageReceivedByGateway) =>
	(media: Media) => {
		socket.emit('reply_with_sticker', replyWithSticker(messagePayload, media));
	};
