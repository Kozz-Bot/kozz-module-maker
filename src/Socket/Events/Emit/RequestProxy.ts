import { ProxyRequestPayload } from 'kozz-types';
import { Socket } from 'socket.io-client';
import { ProxyInitParams } from '../../../Instance/Proxy';
import { onProxiedMessage } from '../Handle/ProxiedMessage';

const createProxyRequestPayload = (
	proxyInitParams: ProxyInitParams
): ProxyRequestPayload => {
	return {
		source: proxyInitParams.source,
		destination: proxyInitParams.destinationOverride || proxyInitParams.name,
	};
};

/**
 * Request proxy for a given
 * @param socket
 * @param proxyInitParams
 */
export const requestProxy = (
	socket: Socket,
	proxyInitParams: ProxyInitParams
) => {
	onProxiedMessage(socket, proxyInitParams.source, proxyInitParams.onMessage);

	socket.emit('request_proxy', createProxyRequestPayload(proxyInitParams));
};
