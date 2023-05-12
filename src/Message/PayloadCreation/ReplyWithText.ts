import { Command, SendMessagePayload } from 'kozz-types/dist';

export const replyWithText = (
	command: Command,
	string: string
): SendMessagePayload => ({
	body: string,
	boundaryId: command.boundaryId,
	chatId: command.message.fromHostAccount
		? command.message.to
		: command.message.from,
	contact: command.message.contact,
	platform: command.message.platform,
	timestamp: new Date().getTime(),
	quoteId: command.message.id,
});
