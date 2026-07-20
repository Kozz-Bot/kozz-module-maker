import {
	Command,
	MessageReceived,
	MessageReceivedByGateway,
	ProxySource,
} from 'kozz-types';
import { Socket } from 'socket.io-client';
import { createMessageObject } from 'src/Message';
import { revokeProxy } from '../../Socket/Events/Emit/RevokeProxy';

export type ProxiedMessageObject = ReturnType<typeof createProxiedMessageOject>;

export const createProxiedMessageOject = (
	socket: Socket,
	source: ProxySource,
	message: MessageReceivedByGateway,
	handlerName: string
) => {
	const messageObject = createMessageObject(socket, message, handlerName);

	const revoke = () => revokeProxy(socket, source);

	return {
		...messageObject,
		revoke,
	};
};
