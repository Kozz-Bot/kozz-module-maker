import { ManagerOptions, SocketOptions, io } from 'socket.io-client';
import { introduce } from './Events/Emit/Introduction';
import { Method } from '../Schema';
import { UseFn } from '../Instance/Common';
import { onCommand } from './Events/Handle/Command';

export const connect = (
	onConnect: (...args: any[]) => any,
	address: string,
	moduleUseFns: UseFn[],
	templatePath: string,
	handlerName: string,
	boundariesToHandle: string[],
	socketPath: string = '/socket.io/'
) => {
	const connectionObj: Partial<SocketOptions & ManagerOptions> = {
		path: socketPath,
	};

	const socket = io(address, connectionObj);

	socket.on('connect', onConnect);

	const registerMethods = <
		T extends Record<string, Method<Record<string, any>>>
	>(
		methods: T
	) =>
		onCommand(
			socket,
			methods,
			moduleUseFns,
			handlerName,
			templatePath,
			boundariesToHandle
		);

	return {
		socket,
		registerMethods,
	};
};
