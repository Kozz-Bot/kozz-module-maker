// @ts-nocheck

import dotenv from 'dotenv';
dotenv.config();

import { createHandlerInstance } from './Instance';
import { Method, createMethod } from './Schema';

import { describeType, isArgValid, isArgsObjectValid } from './Validator';

const defaultMethod = createMethod({
	name: 'test',
	args: {
		test: 'boolean[]?',
	},

	func: ({ test }) => {
		console.log(test);
	},
});

const hello = createMethod({
	name: 'default',
	args: {
		test: 'string',
	},
	func: args => {
		console.log(args);
	},
});

createHandlerInstance({
	name: 'hi',
	address: `${process.env.GATEWAY_URL}`,
	methods: {
		...hello,
	},
});
