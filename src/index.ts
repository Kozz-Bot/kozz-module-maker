import { createHandlerInstance } from './Instance';
import { createMethod } from './Schema';

export * from './Instance';
export * from './Schema';

createHandlerInstance({
	name: 'debug',
	address: `http://gramont.ddns.net:4521`,
	methods: {
		...createMethod({
			name: 'default',
			args: {},
			func: (requester, args) => {
				requester.reply.withText('wasdasd');
			},
		}),
	},
});
