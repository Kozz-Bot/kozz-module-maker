import { ProxyRequestPayload, ProxySource } from 'kozz-types';
import { Socket } from 'socket.io-client';
import { ProxiedMessageObject } from 'src/Message/ProxiedMessage';

export type ProxySourceInput = ProxySource | string;

export type ProxyInitParams = {
	address: string;
	source: ProxySourceInput;
	name: string;
	subscriber?: string;
	signature?: string;
	onMessage: (message: ProxiedMessageObject) => any;
};

export const normalizeProxySource = (source: ProxySourceInput): ProxySource => {
	if (typeof source !== 'string') {
		return source;
	}

	const separatorIndex = source.indexOf('/');
	if (separatorIndex === -1) {
		throw new Error(`Invalid proxy source ${source}`);
	}

	const boundary = source.slice(0, separatorIndex);
	const chatExpression = source.slice(separatorIndex + 1);

	if (!boundary || !chatExpression) {
		throw new Error(`Invalid proxy source ${source}`);
	}

	if (chatExpression === '*') {
		return {
			boundary,
			chats: '*',
		};
	}

	if (chatExpression.startsWith('[') && chatExpression.endsWith(']')) {
		const chats = chatExpression
			.slice(1, -1)
			.split(',')
			.map(chat => chat.trim())
			.filter(Boolean);

		if (!chats.length) {
			throw new Error(`Invalid proxy source ${source}`);
		}

		return {
			boundary,
			chats,
		};
	}

	return {
		boundary,
		chats: [chatExpression],
	};
};

const createProxyRequestPayload = (
	proxyInitParams: ProxyInitParams
): ProxyRequestPayload => {
	return {
		source: normalizeProxySource(proxyInitParams.source),
		subscriber: proxyInitParams.subscriber || proxyInitParams.name,
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
	socket.emit('request_proxy', createProxyRequestPayload(proxyInitParams));
};
