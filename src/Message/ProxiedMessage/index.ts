import {
	Command,
	MessageReceived,
	MessageReceivedByGateway,
	Source,
} from 'kozz-types';
import { Socket } from 'socket.io-client';
import { createMessageObject } from '..';
import { revokeProxy } from '../../Socket/Events/Emit/RevokeProxy';

export type ProxiedMessageObject = ReturnType<typeof createProxiedMessageOject>;

export const createProxiedMessageOject = (
	socket: Socket,
	source: Source,
	message: MessageReceivedByGateway,
	handlerName: string
) => {
	//[TODO]: This is awful. I need to improve this lmao;
	const pseudoCommand: Command = {
		boundaryId: message.boundaryId,
		immediateArg: '',
		message,
		method: '',
		namedArgs: {},
		query: '',
		// This shouldn't be necessary
		boundaryName: message.boundaryName,
		taggedContacts: [],
	};

	const messageObject = createMessageObject(socket, pseudoCommand, handlerName);

	const revoke = () => revokeProxy(socket, source);

	return {
		...messageObject,
		revoke,
	};
};
