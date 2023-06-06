import { Command } from 'kozz-types';
import { Socket } from 'socket.io-client';
import { createReply } from './RoutineCreation/reply';
import { createAskResource } from './RoutineCreation/AskResource';
import { sendMessageToContactAfterCommand } from './RoutineCreation/SendMessage';

export type MessageObj = ReturnType<typeof createMessageObject>;

export const createMessageObject = (
	socket: Socket,
	command: Command,
	handlerId: string,
	templatePath?: string
) => {
	/**
	 * Replies the requester of the command.
	 */
	const reply = createReply(socket, command, templatePath);
	const sendMessage = sendMessageToContactAfterCommand(socket, command);
	const ask = createAskResource(socket, {
		requester: {
			id: handlerId,
			type: 'Handler',
		},
	});

	return {
		ask,
		sendMessage,
		rawCommand: command,
		media: command.message.media,
		quotedMessage: command.message.quotedMessage,
		body: command.message.body,
		type: command.message.messageType,
		isViewOnce: command.message.isViewOnce,
		reply,
	};
};
