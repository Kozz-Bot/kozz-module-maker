import { HandlerIntroduction } from 'kozz-types/dist';
import { Socket } from 'socket.io-client';
import { MethodWithName } from '../../Schema';
import { Type } from '../../Validator';

export const introduce = <T extends Record<string, Type>>(
	socket: Socket,
	handlerName: string,
	methods: MethodWithName<T>[]
) => {
	console.log({ methods });
	const payload: HandlerIntroduction = {
		methods: methods.map(m => m.methodName),
		name: handlerName,
		role: 'handler',
		timestamp: new Date().getTime(),
	};

	socket.emit('introduction', payload);
};
