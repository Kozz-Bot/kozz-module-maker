import { Socket } from 'socket.io-client';
import {
	ProxiedMessageObject,
	createProxiedMessageOject,
} from '../../../Message/ProxiedMessage';
import { ProxySourceInput, normalizeProxySource } from '../Emit/RequestProxy';

/**
 * Handles the message proxied to the handler
 * @param socket
 * @param source
 * @param cb
 */
export const onProxiedMessage = (
	socket: Socket,
	source: ProxySourceInput,
	handlerName: string,
	cb: (message: ProxiedMessageObject) => any
) => {
	const normalizedSource = normalizeProxySource(source);
	socket.removeAllListeners('proxied_message');
	socket.on('proxied_message', payload => {
		const proxiedMessageObject = createProxiedMessageOject(
			socket,
			normalizedSource,
			payload,
			handlerName
		);
		cb(proxiedMessageObject);
	});
};
