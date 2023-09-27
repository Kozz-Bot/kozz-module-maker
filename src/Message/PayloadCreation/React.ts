import { Command, MessageReceivedByGateway } from 'kozz-types';
import { Socket } from 'socket.io-client';

export const createReact = (
	socket: Socket,
	messagePayload: MessageReceivedByGateway
) => {
	const react = (emote: string) =>
		socket.emit('react_message', {
			messageId: messagePayload.id,
			boundaryId: messagePayload.boundaryId,
			emote,
		});

	return react;
};
