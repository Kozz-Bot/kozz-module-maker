import { Command, Media, SendMessagePayload } from 'kozz-types';

export const replyWithText = (
	command: Command,
	string: string
): SendMessagePayload => ({
	body: string,
	boundaryId: command.boundaryId,
	chatId: command.message.to,
	contact: command.message.contact,
	platform: command.message.platform,
	timestamp: new Date().getTime(),
	quoteId: command.message.id,
});

export const replyWithSticker = (
	command: Command,
	media: Media
): SendMessagePayload => ({
	body: '',
	media: media,
	chatId: command.message.to,
	platform: 'WA',
	timestamp: new Date().getTime(),
	quoteId: command.message.id,
	boundaryId: command.boundaryId,
  contact: command.message.contact,
});

export const replyWithMedia = (
	command: Command,
	media: Media,
	caption?: string
): SendMessagePayload => ({
	body: caption || '',
	media: media,
	chatId: command.message.to,
	platform: 'WA',
	timestamp: new Date().getTime(),
	quoteId: command.message.id,
	boundaryId: command.boundaryId,
	contact: command.message.contact,
});
