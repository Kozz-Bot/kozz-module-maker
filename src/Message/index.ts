import { Command, MessageReceivedByGateway } from 'kozz-types';
import { Socket } from 'socket.io-client';
import { createReply } from './RoutineCreation/reply';
import { createAskResource } from './RoutineCreation/AskResource';
import { sendMessageToContactOnRequesterObject } from './RoutineCreation/SendMessage';
import { createReact } from './PayloadCreation/React';
export * from './FromTemplate';

export type MessageObj = ReturnType<typeof createMessageObject>;

export const createMessageObject = (
	socket: Socket,
	messagePayload: MessageReceivedByGateway,
	handlerId: string,
	templatePath?: string,
	command?: Command
) => {
	/**
	 * Replies the requester of the command.
	 */
	const reply = createReply(socket, messagePayload, templatePath);
	const sendMessage = sendMessageToContactOnRequesterObject(
		socket,
		handlerId,
		messagePayload.from
	);

	const ask = createAskResource(socket, {
		requester: {
			id: handlerId,
			type: 'Handler',
		},
	});
	const react = createReact(socket, messagePayload);

	return {
		ask,
		sendMessage,
		react,
		rawCommand: command,
		message: messagePayload,
		reply,
	};
};
