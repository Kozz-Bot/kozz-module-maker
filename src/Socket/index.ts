import { io } from 'socket.io-client';
import { introduce } from './Messages/Introduction';
import { type Command } from 'kozz-types';
import { Method, TypeString } from '../Schema';
import { isArgsObjectValid } from '../Validator';
import { createMessageObject } from '../Message';

export const connect = (address: string) => {
	const socket = io(address);

	const introduceFn = <T extends Record<string, any>>(
		handlerName: string,
		methods: T
	) => {
		introduce(socket, handlerName, methods);
	};

	const registerMethods = <
		T extends Record<string, Method<Record<string, any>>>
	>(
		methods: T
	) =>
		socket.on('command', (command: Command) => {
			if (Object.keys(methods).includes(command.method)) {
				const actualMethod = methods[command.method];
				if (isArgsObjectValid(command.namedArgs, actualMethod.args)) {
					const message = createMessageObject(socket, command);
					actualMethod.func(message, command.namedArgs);
				}
			}
		});

	return {
		socket,
		introduce: introduceFn,
		registerMethods,
	};
};
