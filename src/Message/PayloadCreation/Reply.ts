import type {
	Media,
	MessageReceivedByGateway,
	SendMessagePayload,
} from 'kozz-types';

export const replyWithText = (
	messagePayload: MessageReceivedByGateway,
	string: string
): SendMessagePayload => ({
	body: string,
	boundaryId: messagePayload.boundaryId,
	chatId: messagePayload.to,
	contact: messagePayload.contact,
	platform: messagePayload.platform,
	timestamp: new Date().getTime(),
	quoteId: messagePayload.id,
});

export const replyWithSticker = (
	messagePayload: MessageReceivedByGateway,
	media: Media
): SendMessagePayload => ({
	body: '',
	media: media,
	chatId: messagePayload.to,
	platform: 'other',
	timestamp: new Date().getTime(),
	quoteId: messagePayload.id,
	boundaryId: messagePayload.boundaryId,
	contact: messagePayload.contact,
});

export const replyWithMedia = (
	messagePayload: MessageReceivedByGateway,
	media: Media,
	caption?: string
): SendMessagePayload => ({
	body: caption || '',
	media: media,
	chatId: messagePayload.to,
	platform: 'other',
	timestamp: new Date().getTime(),
	quoteId: messagePayload.id,
	boundaryId: messagePayload.boundaryId,
	contact: messagePayload.contact,
});

export const replyWithMediaFromUrl = (
	messagePayload: MessageReceivedByGateway,
	media: Media,
	caption?: string
): SendMessagePayload => ({
	body: caption || '',
	media: media,
	chatId: messagePayload.to,
	platform: 'other',
	timestamp: new Date().getTime(),
	quoteId: messagePayload.id,
	boundaryId: messagePayload.boundaryId,
	contact: messagePayload.contact,
});
