import { createHandlerInstance, Method, typeChecker } from './Schema';

const { addMethod, availableCommands } = createHandlerInstance();

addMethod('default', {
	test: 'number[]',
	myArg: 'boolean?',
	obj: {
		test: 'string',
		key: 'number',
		roled: 'string[]',
	},
});

console.log(availableCommands);

console.log(typeChecker(availableCommands[0].namedArgs));
