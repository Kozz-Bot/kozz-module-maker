import { Command, MessageReceivedByGateway } from 'kozz-types';
import { Socket } from 'socket.io-client';
import { createReply } from './RoutineCreation/reply';
import { createAskResource } from './RoutineCreation/AskResource';
import { sendMessageToContactOnRequesterObject } from './RoutineCreation/SendMessage';
import { createReact } from './PayloadCreation/React';
import { addSelfDeleteToMessages } from './RoutineCreation/DeleteMessage';
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
		messagePayload.boundaryId
	);

	/**
	 * Ask for resources to other entities connected to the same gateway.
	 */
	const ask = createAskResource(socket, {
		requester: {
			id: handlerId,
			type: 'Handler',
		},
	});

	const react = createReact(socket, messagePayload);

	const messagesWithSelfDelete = addSelfDeleteToMessages(
		socket,
		messagePayload
	);

	return {
		ask,
		sendMessage,
		react,
		rawCommand: command,
		message: messagesWithSelfDelete,
		reply,
	};
};
