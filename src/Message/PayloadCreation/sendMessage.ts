import { Command, ContactID, Media, SendMessagePayload } from 'kozz-types';

export const sendMessage = (
	command: Command,
	body: string,
	contactId: string,
	media?: Media
): SendMessagePayload => {
	return {
		body,
		boundaryId: command.boundaryId,
		chatId: contactId,
		contact: command.message.contact,
		platform: command.message.platform,
		timestamp: new Date().getTime(),
		quoteId: undefined,
	};
};
