import { io } from 'socket.io-client';
import { MethodWithName } from '../Schema';
import { Type } from '../Validator';
import { introduce } from './Messages/Introduction';

export const connect = (address: string) => {
	const socket = io(address);

	const introduceFn = <T extends Record<string, Type>>(
		handlerName: string,
		methods: MethodWithName<T>[]
	) => {
		introduce(socket, handlerName, methods);
	};

	return {
		socket,
		introduce: introduceFn,
	};
};
