import { Socket } from 'socket.io-client';
import { AskResourcePayload, ProvideResourcePayload } from 'kozz-types';

type RequestData = {
	[key in keyof AskResourcePayload]: key extends 'request'
		? Omit<AskResourcePayload[key], 'id'>
		: AskResourcePayload[key];
};

export const ask = async (
	socket: Socket,
	requestData: RequestData
): Promise<ProvideResourcePayload> => {
	const requestId: `${string}/${number}` = `${requestData.responder.id}/${requestData.timestamp}`;

	const requestPayload: AskResourcePayload = {
		...requestData,
		request: {
			...requestData.request,
			id: requestId,
		},
	};

	socket.emit('ask_resource', requestPayload);

	return new Promise(resolve => {
		console.log(`awaiting promise on event "reply_resource/${requestId}"`);

		socket.once(
			`reply_resource/${requestId}`,
			(payload: ProvideResourcePayload) => {
				console.log('got response');

				resolve(payload);
			}
		);
	});
};
