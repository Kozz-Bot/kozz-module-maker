import { ForwardEventPayload } from 'kozz-types';
import { Socket } from 'socket.io-client';

type EventCallback = (payload: any) => any;

export const listenBoundary =
	(gatewaySocket: Socket, instanceName: string) => (boundaryId: string) => {
		return {
			when: (eventName: string, callback: EventCallback) => {
				const payload: ForwardEventPayload = {
					destination: {
						id: instanceName,
						type: 'Handler',
					},
					eventName,
					sourceId: boundaryId,
				};
				gatewaySocket.emit('event_forward_request', payload);
				gatewaySocket.on(eventName, callback);
			},
		};
	};
