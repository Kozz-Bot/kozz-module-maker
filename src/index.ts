import { createHandlerInstance } from './Instance/Handler';

import dotenv from 'dotenv';
dotenv.config();

export * from './Instance/Handler';
export * from './Instance/Proxy';
export * from './Instance/Basic';
export * from './Schema';

const testHandler = createHandlerInstance({
	name: 'debug',
	address: `${process.env.GATEWAY_URL}`,
	methods: {},
	boundariesToHandle: ['postman-test'],
}).resources.upsertResource('help', () => {
	return new Promise(resolve => {
		setTimeout(() => resolve('done'), 1500);
	});
});
