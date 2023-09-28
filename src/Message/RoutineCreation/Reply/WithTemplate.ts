import { Command, MessageReceivedByGateway } from 'kozz-types/dist';
import { Socket } from 'socket.io-client';
import { loadTemplates } from '../../FromTemplate';
import { replyWithText } from '../../PayloadCreation';

export const withTemplate =
	(
		socket: Socket,
		messagePayload: MessageReceivedByGateway,
		templatePath?: string
	) =>
	(templateName: string, templateData: Record<string, any> = {}) => {
		if (!templatePath) {
			throw 'Trying to reply with template but no template path was provided';
		}

		loadTemplates(templatePath)
			.getTextFromTemplate(templateName, templateData)
			.then(textResponse => {
				if (!textResponse) {
					throw `Error while trying to reply from template ${templateName}, could not find it's template in ${templatePath}`;
				}
				socket.emit(
					'reply_with_text',
					replyWithText(messagePayload, textResponse)
				);
			});
	};
