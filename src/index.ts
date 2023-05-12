import dotenv from 'dotenv';
dotenv.config();

import { createHandlerInstance } from './Instance';
import { createMethod } from './Schema';

createHandlerInstance({
	name: 'ping',
	address: `${process.env.GATEWAY_URL}`,
	methods: createMethod({
		name: 'default',
		args: {},
		func: message => {
			message.reply('pong');
		},
	}),
});
