import { io } from 'socket.io-client';
import { introduce } from './Events/Emit/Introduction';
import { type Command } from 'kozz-types';
import { Method } from '../Schema';
import { UseFn } from '../Instance/Handler';
import { onCommand } from './Events/Handle/Command';

export const connect = <T extends Record<string, any>>(
	address: string,
	moduleUseFns: UseFn[],
	templatePath: string,
	handlerName: string,
	methods: T
) => {
	const socket = io(address);

	introduce(socket, handlerName, methods);

	const registerMethods = <
		T extends Record<string, Method<Record<string, any>>>
	>(
		methods: T
	) => onCommand(socket, methods, moduleUseFns, templatePath);

	return {
		socket,
		registerMethods,
	};
};
