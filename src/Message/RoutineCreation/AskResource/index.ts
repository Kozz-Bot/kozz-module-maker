import { AskResourcePayload } from 'kozz-types/dist';
import { Socket } from 'socket.io-client';
import { ask as askResourceFn } from './AskResourceApi';

type RequestResourceArgs = {
	requester: AskResourcePayload['requester'];
};

type AskResourceArgs = {
	resource: Omit<AskResourcePayload['request'], 'id'>;
	responder: AskResourcePayload['responder'];
};

export const createAskResource = (
	socket: Socket,
	args: RequestResourceArgs
) => {
	const ask = async (askArgs: AskResourceArgs) => {
		const response = await askResourceFn(socket, {
			request: askArgs.resource,
			responder: askArgs.responder,
			requester: args.requester,
			timestamp: new Date().getTime(),
		});
		return response;
	};

	ask.boundary = (
		boundaryId: string,
		resourceName: string,
		args: AskResourceArgs['resource']['data'] = {}
	) => {
		return askResourceFn(socket, {
			request: {
				resource: resourceName,
				data: args,
			},
			requester: args.requester,
			timestamp: new Date().getTime(),
			responder: {
				id: boundaryId,
				type: 'Boundary',
			},
		});
	};

	ask.handler = (
		handlerId: string,
		resourceName: string,
		args: AskResourceArgs['resource']['data'] = {}
	) => {
		return askResourceFn(socket, {
			request: {
				resource: resourceName,
				data: args,
			},
			requester: args.requester,
			timestamp: new Date().getTime(),
			responder: {
				id: handlerId,
				type: 'Handler',
			},
		});
	};

	return ask;
};
