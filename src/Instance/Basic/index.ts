import { connect } from '../../Socket';
import { onAskResource } from '../../Socket/Events/Handle/AskResource';
import { createResourceMap, createUseFns } from '../Common/';
import { createAskResource } from '../../Message/RoutineCreation/AskResource';
import { sendMessageToContact } from '../../Message/RoutineCreation/SendMessage';
import { listenBoundary } from 'src/Socket/Events/Emit/ForwardEvent';

type BasicControllerInitParams = {
	name: string;
	address: string;
	templatePath?: string;
	signature?: string;
};

/**
 * Creates a basic Handler Controller
 * @param param0
 * @returns
 */
export const createBasicController = ({
	address,
	name,
	templatePath,
	signature,
}: BasicControllerInitParams) => {
	const { moduleUseFns, use } = createUseFns(() => instance);

	const { socket } = connect(
		address,
		moduleUseFns,
		templatePath || '',
		name,
		{},
		[],
		signature
	);
	// @ts-ignore
	const { removeResource, resourceMap, upsertResource } = createResourceMap();
	onAskResource(socket, resourceMap);

	const ask = createAskResource(socket, {
		requester: {
			id: name,
			type: 'Handler',
		},
	});

	/**
	 * Routine to send message to any given boundary
	 */
	const sendMessage = sendMessageToContact(socket, name);

	const listenToBoundary = listenBoundary(socket, name);

	const instance = {
		sendMessage,
		use,
		removeResource,
		upsertResource,
		listenToBoundary,
		ask,
	};

	return instance;
};
