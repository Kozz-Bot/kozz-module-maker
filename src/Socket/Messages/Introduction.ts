import { HandlerIntroduction } from 'kozz-types/dist';
import { Socket } from 'socket.io-client';
import { Method, MethodMap, TypeString } from '../../Schema';

export const introduce = <
	T extends Record<string, Method<Record<string, TypeString>>>
>(
	socket: Socket,
	handlerName: string,
	methods: T
) => {
	const payload: HandlerIntroduction = {
		methods: Object.keys(methods),
		name: handlerName,
		role: 'handler',
		timestamp: new Date().getTime(),
	};

	socket.emit('introduction', payload);
};
