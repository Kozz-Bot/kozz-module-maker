import type { Media, SendMessagePayload } from 'kozz-types';

export const createSendMessagePayload = (
	handlerName: string,
	contactId: string,
	boundaryId: string,
	body: string,
	media?: Media
): SendMessagePayload => {
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
			isGroup: false,
			isHostAccount: true,
		},
		platform: 'other',
		timestamp: new Date().getTime(),
		quoteId: undefined,
		media,
	};
};
