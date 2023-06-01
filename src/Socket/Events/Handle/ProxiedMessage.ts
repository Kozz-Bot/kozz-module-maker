import { Source } from 'kozz-types';
import { Socket } from 'socket.io-client';
import {
	ProxiedMessageObject,
	createProxiedMessageOject,
} from 'src/Message/ProxiedMessage';

export const onProxiedMessage = (
	socket: Socket,
	source: Source,
	cb: (message: ProxiedMessageObject) => any
) => {
	socket.on('proxied_message', payload => {
		const proxiedMessageObject = createProxiedMessageOject(
			socket,
			source,
			payload
		);
		cb(proxiedMessageObject);
	});
};
