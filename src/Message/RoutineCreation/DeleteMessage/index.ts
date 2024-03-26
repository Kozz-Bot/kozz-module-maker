import { MessageReceivedByGateway } from 'kozz-types';
import { Socket } from 'socket.io-client';
import { createDeleteMessagePayload } from './../../PayloadCreation';

export type ProcessedMessage = MessageReceivedByGateway & {
	delete: (local?: boolean) => any;
	quotedMessage: ProcessedMessage | undefined;
};

export const createSelfDelete =
	(socket: Socket, messagePayload: MessageReceivedByGateway) =>
	(localDelete = false) => {
		const deletePayload = createDeleteMessagePayload(
			messagePayload.boundaryName,
			messagePayload.id,
			localDelete
		);
		return socket.emit('delete_message', deletePayload);
	};

export const addSelfDeleteToMessages = (
	socket: Socket,
	message: MessageReceivedByGateway
): ProcessedMessage => {
	return {
		...message,
		delete: createSelfDelete(socket, message),
		quotedMessage: message.quotedMessage
			? addSelfDeleteToMessages(socket, message.quotedMessage)
			: undefined,
	};
};
