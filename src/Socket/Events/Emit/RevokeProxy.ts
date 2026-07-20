import { ProxyRevokePayload } from 'kozz-types';
import { Socket } from 'socket.io-client';
import { ProxySourceInput, normalizeProxySource } from './RequestProxy';

/**
 * Request the revoking of a proxy
 * @param socket
 * @param source
 */
export const revokeProxy = (
	socket: Socket,
	source: ProxySourceInput,
	subscriber?: string
) => {
	const payload: ProxyRevokePayload = {
		source: normalizeProxySource(source),
		subscriber,
	};

	socket.emit('revoke_proxy', payload);
};
