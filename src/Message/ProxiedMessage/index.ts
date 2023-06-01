import { Command, MessageReceived, Source } from 'kozz-types';
import { Socket } from 'socket.io-client';
import { createMessageObject } from '..';
import { revokeProxy } from '../../Socket/Events/Emit/RevokeProxy';

export type ProxiedMessageObject = ReturnType<typeof createProxiedMessageOject>;

export const createProxiedMessageOject = (
	socket: Socket,
	source: Source,
	message: MessageReceived
) => {
	//[TODO]: This is awful. I need to improve this lmao;
	const pseudoCommand: Command = {
		boundaryId: message.boundaryId,
		immediateArg: '',
		message,
		method: '',
		namedArgs: {},
	};

	const messageObject = createMessageObject(socket, pseudoCommand);

	const revoke = () => revokeProxy(socket, source);

	return {
		...messageObject,
		revoke,
	};
};
