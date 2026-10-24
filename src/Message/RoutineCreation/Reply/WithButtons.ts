import type { MessageReceivedByGateway, ReplyButtonsOptions, SendMessagePayload } from 'kozz-types';
import type { Socket } from 'socket.io-client';
import { replyWithText } from '../../PayloadCreation/Reply';

export const withButtons = (socket: Socket, message: MessageReceivedByGateway) =>
	(body: string, options: ReplyButtonsOptions) => {
		// Keep typed commands visible even when the recipient cannot render buttons
		// or this payload is handled by an older boundary.
		const fallback = options.buttons.map(button => `${button.label}: ${button.command}`).join('\n');
		const payload: SendMessagePayload = {
			...replyWithText(message, `${body}\n\n${fallback}`),
			interactive: {
				...options,
				type: 'buttons',
				allowedContactId: options.audience === 'chat' ? undefined : message.from,
			},
		};
		socket.emit('reply_with_text', payload);
	};
