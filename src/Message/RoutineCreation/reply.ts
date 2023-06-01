import { Command } from 'kozz-types';
import { Socket } from 'socket.io-client';
import { replyWithText } from '../PayloadCreation';

import { withMedia } from './Reply/WithMedia';
import { withSticker } from './Reply/WithSticke';
import { withTemplate } from './Reply/WithTemplate';

export const createReply = (
	socket: Socket,
	command: Command,
	templatePath?: string
) => {
	const reply = (text: string) => {
		socket.emit('reply_with_text', replyWithText(command, text));
	};

	reply.withSticker = withSticker(socket, command);
	reply.withTemplate = withTemplate(socket, command, templatePath);
	reply.withMedia = withMedia(socket, command);

	return reply;
};
