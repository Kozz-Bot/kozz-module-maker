import { Socket } from 'socket.io-client';
import { Command } from 'kozz-types';
import { Method, UseFn } from '../../..';
import { createMessageObject } from '../../../Message';
import { isArgsObjectValid } from '../../../Validator';
import { normalizeString, runUse } from '../../../util';

/**
 * Handles the command received. It will check if the boundary should have it's command handled,
 * find the correct method, parse, typecheck the args, run the middlewares and try to run the method
 * @param socket
 * @param methods
 * @param moduleUseFns
 * @param handlerName
 * @param templatePath
 * @param boundariesToHandle
 */
export const onCommand = <
	T extends Record<string, Method<Record<string, any>>>
>(
	socket: Socket,
	methods: T,
	moduleUseFns: UseFn[],
	handlerName: string,
	templatePath: string,
	boundariesToHandle: string[]
) => {
	socket.on('command', (command: Command) => {
		// If the handler doesnt want to handle commands for the provided boundary
		if (
			!boundariesToHandle.includes(command.boundaryId) &&
			!boundariesToHandle.includes('*')
		) {
			return;
		}

		const actualMethod =
			methods[normalizeString(normalizeString(command.method))] ||
			methods['fallback'];
		if (!actualMethod) return;

		if (isArgsObjectValid(command.namedArgs, actualMethod.args)) {
			const message = createMessageObject(
				socket,
				runUse(moduleUseFns, command),
				handlerName,
				templatePath
			);
			socket.emit('react_message', {
				messageId: command.message.id,
				boundaryId: command.boundaryId,
				emote: '✔',
			});

			actualMethod.func(message, command.namedArgs);
		} else {
			socket.emit('react_message', {
				messageId: command.message.id,
				boundaryId: command.boundaryId,
				emote: '❌',
			});
		}
	});
};
