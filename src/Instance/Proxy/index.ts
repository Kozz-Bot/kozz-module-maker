import { revokeProxy } from 'src/Socket/Events/Emit/RevokeProxy';
import { connect } from '../../Socket';
import { UseFn } from '../Handler';
import { Source } from 'kozz-types';
import { requestProxy } from 'src/Socket/Events/Emit/RequestProxy';
import { ProxiedMessageObject } from 'src/Message/ProxiedMessage';

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
	const moduleUseFns: UseFn[] = [];

	const { socket } = connect(address, moduleUseFns, '', name, {});

	requestProxy(socket, {
		address,
		destinationOverride,
		name,
		source,
		onMessage,
	});

	const use = (useFn: UseFn) => {
		moduleUseFns.push(useFn);
		return instance;
	};

	const revoke = () => revokeProxy(socket, source);

	const instance = {
		use,
		revoke,
	};

	return instance;
};
