import { Command, Media, MessageReceivedByGateway } from 'kozz-types';
import { Socket } from 'socket.io-client';
import { createSendMessagePayload } from '../../PayloadCreation/sendMessage';

export const sendMessageToContactOnRequesterObject = (
	socket: Socket,
	handlerName: string,
	boundaryId: string
) => {
	const sendMessage = (contactId: string, body: string) => {
		const payload = createSendMessagePayload(
			handlerName,
			contactId,
			boundaryId,
			body
		);

		socket.emit('send_message', payload);
	};

	sendMessage.toOtherBoundary = (
		otherBoundary: string,
		contactId: string,
		body: string
	) => {
		const payload = createSendMessagePayload(
			handlerName,
			contactId,
			otherBoundary,
			body
		);

		socket.emit('send_message', payload);
	};

	sendMessage.withMedia = (
		contactId: string,
		caption: string,
		media: Media
	) => {
		const payload = createSendMessagePayload(
			handlerName,
			contactId,
			boundaryId,
			caption,
			media
		);

		socket.emit('send_message', payload);
	};

	return sendMessage;
};

export const sendMessageToContact = (socket: Socket, handlerName: string) => {
	const sendMessage = (contactId: string, boundaryId: string, body: string) => {
		const payload = createSendMessagePayload(
			handlerName,
			contactId,
			boundaryId,
			body
		);

		socket.emit('send_message', payload);
	};

	sendMessage.withMedia = (
		contactId: string,
		boundaryId: string,
		caption: string,
		media: Media
	) => {
		const payload = createSendMessagePayload(
			handlerName,
			contactId,
			boundaryId,
			caption,
			media
		);

		socket.emit('send_message', payload);
	};

	return sendMessage;
};
