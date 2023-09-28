import { Source } from 'kozz-types';
import { Socket } from 'socket.io-client';
import {
	ProxiedMessageObject,
	createProxiedMessageOject,
} from '../../../Message/ProxiedMessage';

/**
 * Handles the message proxied to the handler
 * @param socket
 * @param source
 * @param cb
 */
export const onProxiedMessage = (
	socket: Socket,
	source: Source,
	cb: (message: ProxiedMessageObject) => any
) => {
	socket.on('proxied_message', payload => {
		const proxiedMessageObject = createProxiedMessageOject(
			socket,
			source,
			payload,
			source.split('/')[0]
		);
		cb(proxiedMessageObject);
	});
};
