import { ProxyRequestPayload, Source } from 'kozz-types';
import { Socket } from 'socket.io-client';
import { onProxiedMessage } from '../Handle/ProxiedMessage';
import { ProxiedMessageObject } from 'src/Message/ProxiedMessage';

export type ProxyInitParams = {
	address: string;
	source: Source;
	name: string;
	destinationOverride?: string;
	signature?: string;
	onMessage: (message: ProxiedMessageObject) => any;
};

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
