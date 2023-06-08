import { revokeProxy } from 'src/Socket/Events/Emit/RevokeProxy';
import { connect } from '../../Socket';
import { Source } from 'kozz-types';
import { requestProxy } from 'src/Socket/Events/Emit/RequestProxy';
import { ProxiedMessageObject } from 'src/Message/ProxiedMessage';
import { onAskResource } from '../../Socket/Events/Handle/AskResource';
import { createResourceMap, createUseFns } from '../Common';
import { sendMessageToContact } from 'src/Message/RoutineCreation/SendMessage';

export type ProxyInitParams = {
	address: string;
	source: Source;
	name: string;
	destinationOverride?: string;
	signature?: string;
	onMessage: (message: ProxiedMessageObject) => any;
};

export const createProxyInstance = ({
	address,
	source,
	name,
	destinationOverride,
	onMessage,
	signature,
}: ProxyInitParams) => {
	const { moduleUseFns, use } = createUseFns(() => instance);

	const { socket } = connect(
		address,
		moduleUseFns,
		'',
		name,
		{},
		[],
		signature
	);
	const revoke = () => revokeProxy(socket, source);

	requestProxy(socket, {
		address,
		destinationOverride,
		name,
		source,
		onMessage,
	});

	const { removeResource, resourceMap, upsertResource } = createResourceMap();
	onAskResource(socket, resourceMap);

	const sendMessage = sendMessageToContact(socket, name);

	const instance = {
		use,
		sendMessage,
		revoke,
		resource: {
			removeResource,
			upsertResource,
		},
	};

	return instance;
};
