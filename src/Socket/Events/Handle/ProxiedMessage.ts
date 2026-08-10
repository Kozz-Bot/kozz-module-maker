import { Socket } from 'socket.io-client';
import {
	ProxiedMessageObject,
	createProxiedMessageOject,
} from '../../../Message/ProxiedMessage';
import {
	normalizeProxySource,
	type ProxyConfig,
	type ProxySourceInput,
} from '../Emit/RequestProxy';
import { type MessageReceivedByGateway, type ProxySource } from 'kozz-types';

const matchesSource = (
	source: ProxySource,
	message: MessageReceivedByGateway
) =>
	source.boundary === message.boundaryName &&
	(source.chats === '*' || source.chats.includes(message.chatId));

export const onProxiedMessages = (
	socket: Socket,
	proxies: readonly ProxyConfig[],
	handlerName: string
) => {
	const normalizedProxies = proxies.map(proxy => ({
		...proxy,
		source: normalizeProxySource(proxy.source),
	}));

	const listener = (payload: MessageReceivedByGateway) => {
		normalizedProxies
			.filter(proxy => matchesSource(proxy.source, payload))
			.forEach(proxy => {
				const proxiedMessageObject = createProxiedMessageOject(
					socket,
					proxy.source,
					payload,
					handlerName
				);
				proxy.onMessage(proxiedMessageObject);
			});
	};

	socket.on('proxied_message', listener);
	return () => socket.off('proxied_message', listener);
};

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
	return onProxiedMessages(socket, [{ source, onMessage: cb }], handlerName);
};
