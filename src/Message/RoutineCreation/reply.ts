import { Command, MessageReceivedByGateway } from 'kozz-types';
import { Socket } from 'socket.io-client';
import { replyWithText } from '../PayloadCreation';

import { withMedia } from './Reply/WithMedia';
import { withSticker } from './Reply/WithSticker';
import { withTemplate } from './Reply/WithTemplate';
import { withButtons } from './Reply/WithButtons';

export const createReply = (
	socket: Socket,
	messagePayload: MessageReceivedByGateway,
	templatePath?: string
) => {
	const reply = (text: string) => {
		socket.emit('reply_with_text', replyWithText(messagePayload, text));
	};

	reply.withSticker = withSticker(socket, messagePayload);
	reply.withTemplate = withTemplate(socket, messagePayload, templatePath);
	reply.withMedia = withMedia(socket, messagePayload);
	reply.withButtons = withButtons(socket, messagePayload);

	return reply;
};
