import { connect } from '../../Socket';
import { onAskResource } from '../../Socket/Events/Handle/AskResource';
import { createResourceMap, createUseFns } from '../Common/';
import { createAskResource } from '../../Message/RoutineCreation/AskResource';
import { sendMessageToContact } from '../../Message/RoutineCreation/SendMessage';

type BasicControllerInitParams = {
	name: string;
	address: string;
	templatePath?: string;
	signature?: string;
};

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

	const sendMessage = sendMessageToContact(socket, name);

	const instance = {
		sendMessage,
		use,
		removeResource,
		upsertResource,
		ask,
	};

	return instance;
};
