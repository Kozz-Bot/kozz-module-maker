import { revokeProxy } from 'src/Socket/Events/Emit/RevokeProxy';
import { connect } from '../../Socket';
import { Source } from 'kozz-types';
import { requestProxy } from 'src/Socket/Events/Emit/RequestProxy';
import { ProxiedMessageObject } from 'src/Message/ProxiedMessage';
import { onAskResource } from '../../Socket/Events/Handle/AskResource';
import { createResourceMap, createUseFns } from '../Common';

export type ProxyInitParams = {
	address: string;
	source: Source;
	name: string;
	destinationOverride?: string;
	onMessage: (message: ProxiedMessageObject) => any;
};

export const createProxyInstance = ({
	address,
	source,
	name,
	destinationOverride,
	onMessage,
}: ProxyInitParams) => {
	const { moduleUseFns, use } = createUseFns(() => instance);

	const { socket } = connect(address, moduleUseFns, '', name, {});
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

	const instance = {
		use,
		revoke,
		resource: {
			removeResource,
			upsertResource,
		},
	};

	return instance;
};
