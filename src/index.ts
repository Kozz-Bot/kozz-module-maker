import dotenv from 'dotenv';
dotenv.config();

import { createHandlerInstance } from './Instance';
import { createMethod } from './Schema';

createHandlerInstance({
	name: 'sticker',
	address: `${process.env.GATEWAY_URL}`,
	methods: {
		...createMethod({
			name: 'default',
			args: {},
			func: message => {
				if (message.quotedMessage?.media) {
					return message.reply.withSticker(message.quotedMessage.media);
				}
				if (message.media) {
					return message.reply.withSticker(message.media);
				}
				message.reply.withText(
					'Responda uma imagem ou video com "!sticker" para fazer figurinha, ou envie o comando na legenda da foto/video'
				);
			},
		}),
	},
});
