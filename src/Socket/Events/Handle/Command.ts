import { Socket } from 'socket.io-client';
import { Command } from 'kozz-types';
import { Method, UseFn } from '../../..';
import { createMessageObject } from '../../../Message';
import { isArgsObjectValid } from '../../../Validator';
import { runUse } from '../../../util';

export const onCommand = <
	T extends Record<string, Method<Record<string, any>>>
>(
	socket: Socket,
	methods: T,
	moduleUseFns: UseFn[],
	templatePath: string
) => {
	socket.on('command', (command: Command) => {
		if (Object.keys(methods).includes(command.method)) {
			const actualMethod = methods[command.method];
			if (isArgsObjectValid(command.namedArgs, actualMethod.args)) {
				const message = createMessageObject(
					socket,
					runUse(moduleUseFns, command),
					templatePath
				);
				actualMethod.func(message, command.namedArgs);
			}
		}
	});
};
