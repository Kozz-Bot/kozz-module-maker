import { Socket } from 'socket.io-client';
import { Command } from 'kozz-types';
import { Method } from '../../..';
import { createMessageObject } from '../../../Message';
import { isArgsObjectValid } from '../../../Validator';
import { normalizeString, runUse } from '../../../util';
import { UseFn } from '../../../Instance/Common';

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
	const execute = async (command: Command) => {
		// If the handler doesnt want to handle commands for the provided boundary
		if (
			!boundariesToHandle.includes(command.boundaryName) &&
			!boundariesToHandle.includes('*')
		) {
			return;
		}

		const actualMethod =
			methods[normalizeString(normalizeString(command.method))] ||
			methods['fallback'];
		if (!actualMethod) return;

		if (isArgsObjectValid(command.namedArgs || {}, actualMethod.args)) {
			const updatedCommand = runUse(moduleUseFns, command);

			if ('abort' in (updatedCommand.namedArgs ?? {})) {
				return;
			}

			const message = createMessageObject(
				socket,
				command.message,
				handlerName,
				templatePath,
				command
			);

			socket.emit('react_message', {
				messageId: command.message.id,
				boundaryId: command.boundaryId,
				emote: '✔',
			});

			await actualMethod.func(message, updatedCommand.namedArgs || {});
			return { executed: true };
		} else {
			socket.emit('react_message', {
				messageId: command.message.id,
				boundaryId: command.boundaryId,
				emote: '❌',
			});
		}
		return { executed: false };
	};
	socket.on('command', command => {
		void execute(command).catch(() => console.warn(`[${handlerName}] Command execution failed`));
	});
	return execute;
};
