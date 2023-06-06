import { Command, ContactID, Media, SendMessagePayload } from 'kozz-types';

export const sendMessageByComand = (
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
		media,
	};
};

export const sendMessageById = (
	handlerName: string,
	contactId: string,
	boundaryId: string,
	body: string,
	media?: Media
) => {
	return {
		body,
		boundaryId: boundaryId,
		chatId: contactId,
		contact: {
			publicName: handlerName,
			privateName: handlerName,
			id: handlerName,
			isBlocked: false,
			hostAdded: true,
		},
		platform: 'Handler',
		timestamp: new Date().getTime(),
		quoteId: undefined,
		media,
	};
};
