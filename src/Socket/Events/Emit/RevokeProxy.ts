import { ProxyRevokePayload, Source } from 'kozz-types';
import { Socket } from 'socket.io-client';

/**
 * Request the revoking of a proxy
 * @param socket
 * @param source
 */
export const revokeProxy = (socket: Socket, source: Source) => {
	const payload: ProxyRevokePayload = {
		source: source,
	};

	socket.emit('revoke_proxy', payload);
};
