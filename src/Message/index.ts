import { Command, Media } from 'kozz-types';
import { Socket } from 'socket.io-client';
import {
	replyWithText,
	replyWithSticker,
	replyWithMedia,
} from './PayloadCreation';
import { loadTemplates } from './FromTemplate';

export type MessageObj = ReturnType<typeof createMessageObject>;

export const createMessageObject = (
	socket: Socket,
	command: Command,
	templatePath: string
) => {
	const reply = (text: string) => {
		socket.emit('reply_with_text', replyWithText(command, text));
	};

	const replySticker = (media: Media) => {
		socket.emit('reply_with_sticker', replyWithSticker(command, media));
	};

	const replyMedia = (media: Media, caption?: string) => {
		socket.emit('reply_with_media', replyWithMedia(command, media, caption));
	};

	const templates = loadTemplates(templatePath);
	const replyWithTemplate = (
		templateName: string,
		templateData: Record<string, any> = {}
	) => {
		templates
			.getTextFromTemplate(templateName, templateData)
			.then(textResponse => {
				if (!textResponse) {
					throw `Error while trying to reply from template ${templateName}, could not find it's template in ${templatePath}`;
				}
				socket.emit('reply_with_text', replyWithText(command, textResponse));
			});
	};

	return {
		rawCommand: command,
		media: command.message.media,
		quotedMessage: command.message.quotedMessage,
		body: command.message.body,
		type: command.message.messageType,
		isViewOnce: command.message.isViewOnce,
		reply: {
			withText: reply,
			withSticker: replySticker,
			withMedia: replyMedia,
			withTemplate: replyWithTemplate,
		},
	};
};
