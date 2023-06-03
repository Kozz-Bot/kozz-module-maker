import { Command, Media } from 'kozz-types';
import { Socket } from 'socket.io-client';
import { sendMessage as createSendMessagePayload } from '../../../Message/PayloadCreation/sendMessage';

export const sendMessageToContact = (socket: Socket, command: Command) => {
	const sendMessage = (contactId: string, text: string) => {
		socket.emit(
			'reply_with_text',
			createSendMessagePayload(command, text, contactId)
		);
	};

	sendMessage.withMedia = (
		contactId: string,
		caption: string,
		media: Media
	) => {
		socket.emit(
			'send_message',
			createSendMessagePayload(command, caption, contactId)
		);
	};

	return sendMessage;
};
