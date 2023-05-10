import dotenv from 'dotenv';
dotenv.config();

import { createHandlerInstance } from './Instance';

const { addMethod, getCommandByName } = createHandlerInstance({
	address: `${process.env.GATEWAY_URL}`,
});

addMethod({
	name: 'default',
	func: ({ animated }) => {},
	args: {
		animated: 'boolean?',
	},
});

getCommandByName('default').namedArgs;
