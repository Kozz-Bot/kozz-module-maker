import { Command } from 'kozz-types/dist';
import { Socket } from 'socket.io-client';
import { loadTemplates } from '../../../Message/FromTemplate';
import { replyWithText } from '../../../Message/PayloadCreation';

export const withTemplate =
	(socket: Socket, command: Command, templatePath: string) =>
	(templateName: string, templateData: Record<string, any> = {}) => {
		loadTemplates(templatePath)
			.getTextFromTemplate(templateName, templateData)
			.then(textResponse => {
				if (!textResponse) {
					throw `Error while trying to reply from template ${templateName}, could not find it's template in ${templatePath}`;
				}
				socket.emit('reply_with_text', replyWithText(command, textResponse));
			});
	};
