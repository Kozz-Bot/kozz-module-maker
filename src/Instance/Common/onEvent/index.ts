import { Socket } from 'socket.io-client';
import { ForwardedEventPayload } from 'kozz-types';
import crypto from 'crypto';

type OnEvent = {
	name: string;
	source: string;
	listeners: {
		id: string;
		cb: (ev: any) => any;
	}[];
};

export const onEvent = (socket: Socket, handlerId: string) => {
	const eventListeners: OnEvent[] = [];

	const getListenersFromEvent = (evName: string) => {
		return eventListeners.find(ev => ev.name === evName);
	};

	const on = (
		evName: string,
		eventSource: string,
		callback: (ev: any) => any
	) => {
		if (!eventListeners.find(listener => listener.name === evName)) {
			eventListeners.push({
				name: evName,
				source: eventSource,
				listeners: [],
			});
		}

		const id = crypto.randomUUID();

		eventListeners
			.find(listener => listener.name === evName)
			?.listeners.push({
				id,
				cb: callback,
			});

		socket.emit('event_forward_request', {
			sourceId: eventSource,
			destination: {
				id: handlerId,
				type: 'Handler',
			},
			eventName: evName,
		});

		return {
			eventId: id,
			revoke: removeListener(evName, id),
		};
	};

	const resendEvents = () => {
		eventListeners.forEach(({ name, listeners, source }) => {
			listeners.forEach(({ id, cb }) => {
				socket.emit('event_forward_request', {
					sourceId: source,
					destination: {
						id: handlerId,
						type: 'Handler',
					},
					eventName: name,
				});
			});
		});
	};

	const removeListener = (evName: string, evId: string) => () => {
		const event = getListenersFromEvent(evName);
		if (!event?.listeners) return;
		event.listeners = event?.listeners.filter(listener => listener.id !== evId);
		if (event.listeners.length === 0) {
			socket.emit('event_forward_revoke', {
				eventName: evName,
				destination: {
					id: handlerId,
					type: 'Handler',
				},
			});
		}
	};

	const tryRunEventListeners = (evName: string, eventPayload: any) => {
		const event = getListenersFromEvent(evName);
		if (!event?.listeners) return;
		event.listeners.forEach(listener => listener.cb(eventPayload));
	};

	socket.on('forwarded_event', (event: ForwardedEventPayload) => {
		console.log('Received Event aaa');
		tryRunEventListeners(event.eventName, event.payload);
	});

	socket.on('connect', resendEvents);

	return {
		on,
		tryRunEventListeners,
	};
};
