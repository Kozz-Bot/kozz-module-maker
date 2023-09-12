import { createHandlerInstance } from './Instance/Handler';
import { loadTemplates } from './Message';
import { createMethod } from './Schema';

export * from './Instance/Handler';
export * from './Instance/Proxy';
export * from './Instance/Basic';
export * from './Schema';

const defaultMethod = createMethod(
	'default',
	(requester, args) => {
		console.log(args);
		requester.reply('pong');
	},
	{
		test: 'number',
	}
);

const templatePath = './src/Handlers/Ping/reply.kozz.md';

createHandlerInstance({
	boundariesToHandle: ['Gramonta-Wa', 'postman-test', 'postman-test-2'],
	name: 'ping',
	address: `http://gramont.ddns.net:4521`,
	methods: {
		...defaultMethod,
	},
	templatePath,
}).resources.upsertResource('help', () =>
	loadTemplates(templatePath).getTextFromTemplate('Help')
);
