import { Command } from 'kozz-types';
import { Socket } from 'socket.io-client';

export const createReact = (socket: Socket, command: Command) => {
	const react = (emote: string) =>
		socket.emit('react_message', {
			messageId: command.message.id,
			boundaryId: command.boundaryId,
			emote,
		});

	return react;
};
