import { Command, Media } from 'kozz-types';
import { Socket } from 'socket.io-client';
import {
	sendMessageByComand,
	sendMessageById,
} from '../../../Message/PayloadCreation/sendMessage';

export const sendMessageToContactAfterCommand = (
	socket: Socket,
	command: Command
) => {
	const sendMessage = (contactId: string, text: string) => {
		socket.emit('send_message', sendMessageByComand(command, text, contactId));
	};

	sendMessage.withMedia = (
		contactId: string,
		caption: string,
		media: Media
	) => {
		socket.emit(
			'send_message',
			sendMessageByComand(command, caption, contactId, media)
		);
	};

	return sendMessage;
};

export const sendMessageToContact = (socket: Socket, handlerName: string) => {
	const sendMessage = (contactId: string, boundaryId: string, body: string) => {
		socket.emit(
			'send_message',
			sendMessageById(handlerName, contactId, boundaryId, body)
		);
	};

	sendMessage.withMedia = (
		contactId: string,
		boundaryId: string,
		caption: string,
		media: Media
	) => {
		socket.emit(
			'send_message',
			sendMessageById(handlerName, contactId, boundaryId, caption, media)
		);
	};

	return sendMessage;
};
