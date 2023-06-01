import { ProxyRevokePayload, Source } from 'kozz-types';
import { Socket } from 'socket.io-client';

export const revokeProxy = (socket: Socket, source: Source) => {
	const payload: ProxyRevokePayload = {
		source: source,
	};

	socket.emit('revoke_proxy', payload);
};
