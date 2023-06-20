import { Socket } from 'socket.io-client';
import { ResourceMap } from '../../../Instance/Common/ResourceMap';
import { AskResourcePayload, ProvideResourcePayload } from 'kozz-types/dist';

/**
 * Provide the resource asked
 * @param socket
 * @param resourceMap
 */
export const onAskResource = (socket: Socket, resourceMap: ResourceMap) => {
	socket.on('ask_resource', (payload: AskResourcePayload) => {
		const resourceGetter = resourceMap[payload.request.resource];
		if (!resourceGetter) return;

		promisify(resourceGetter(payload.request.data)).then(resource => {
			const responsePayload: ProvideResourcePayload = {
				...payload,
				response: resource,
			};

			socket.emit('reply_resource', responsePayload);
		});
	});
};

const promisify = (resource: unknown) => {
	return new Promise(resolve => {
		if (resource instanceof Promise) {
			resource.then(resp => resolve(resp));
		} else {
			resolve(resource);
		}
	});
};
