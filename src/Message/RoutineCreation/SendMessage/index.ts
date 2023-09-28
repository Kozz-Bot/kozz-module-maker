import { Command, Media, MessageReceivedByGateway } from 'kozz-types';
import { Socket } from 'socket.io-client';
import { createSendMessagePayload } from '../../PayloadCreation/sendMessage';

export const sendMessageToContactOnRequesterObject = (
	socket: Socket,
	handlerName: string,
	boundaryId: string
) => {
	const sendMessage = (contactId: string, body: string) => {
		socket.emit(
			'send_message',
			createSendMessagePayload(handlerName, contactId, boundaryId, body)
		);
	};

	sendMessage.withMedia = (
		contactId: string,
		caption: string,
		media: Media
	) => {
		socket.emit(
			'send_message',
			createSendMessagePayload(
				handlerName,
				contactId,
				boundaryId,
				caption,
				media
			)
		);
	};

	return sendMessage;
};

export const sendMessageToContact = (socket: Socket, handlerName: string) => {
	const sendMessage = (contactId: string, boundaryId: string, body: string) => {
		socket.emit(
			'send_message',
			createSendMessagePayload(handlerName, contactId, boundaryId, body)
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
			createSendMessagePayload(
				handlerName,
				contactId,
				boundaryId,
				caption,
				media
			)
		);
	};

	return sendMessage;
};
