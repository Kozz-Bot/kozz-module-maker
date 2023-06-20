import { Socket } from 'socket.io-client';
import { AskResourcePayload, ProvideResourcePayload } from 'kozz-types';

type RequestData = {
	[key in keyof AskResourcePayload]: key extends 'request'
		? Omit<AskResourcePayload[key], 'id'>
		: AskResourcePayload[key];
};

/**
 * Promisified interface for askin resource to other entities connected to the
 * gateway
 * @param socket
 * @param requestData
 * @returns {Promise<ProvideResourcePayload>}
 */
export const ask = async (
	socket: Socket,
	requestData: RequestData
): Promise<ProvideResourcePayload> => {
	const requestId: `${string}/${number}` = `${requestData.responder.id}/${
		requestData.timestamp * 100 + Math.random() * 100
	}`;

	const requestPayload: AskResourcePayload = {
		...requestData,
		request: {
			...requestData.request,
			id: requestId,
		},
	};

	socket.emit('ask_resource', requestPayload);

	return new Promise(resolve => {
		socket.once(
			`reply_resource/${requestId}`,
			(payload: ProvideResourcePayload) => {
				resolve(payload);
			}
		);
	});
};
