import { Method, TypeString } from '../../Schema';
import { createResourceMap, createUseFns, onEvent } from '../Common';
import { connect } from '../../Socket';
import { revokeProxy } from '../../Socket/Events/Emit/RevokeProxy';
import { requestProxy } from '../../Socket/Events/Emit/RequestProxy';
import { ProxiedMessageObject } from '../../Message/ProxiedMessage';
import { Source } from 'kozz-types';
import { onAskResource } from '../../Socket/Events/Handle/AskResource';
import { sendMessageToContact } from '../../Message/RoutineCreation/SendMessage';
import { createAskResource } from '../../Message/RoutineCreation/AskResource';

export type ControllerInitParams<Methods extends Record<string, TypeString>> = {
	name: string;
	address: string;
	templatePath?: string;
	signature?: string;

	commands?: {
		boundariesToHandle: string[];
		methods?: Record<string, Method<Methods>>;
	};

	proxy?: {
		source: Source;
		destinationOverride?: string;
		onMessage: (message: ProxiedMessageObject) => any;
	};
};

export const createModule = <Methods extends Record<string, TypeString>>({
	name,
	address,
	commands,
	proxy,
	signature,
	templatePath,
}: ControllerInitParams<Methods>) => {
	const { moduleUseFns, use } = createUseFns(() => instance);
	const { socket, registerMethods } = connect(
		address,
		moduleUseFns,
		templatePath || '',
		name,
		commands?.methods || {},
		commands?.boundariesToHandle || [],
		signature
	);

	if (commands?.methods) {
		registerMethods(commands?.methods);
	}

	if (proxy) {
		requestProxy(socket, {
			address,
			name,
			...proxy,
		});
	}

	const { removeResource, resourceMap, upsertResource } = createResourceMap();
	onAskResource(socket, resourceMap);

	const sendMessage = sendMessageToContact(socket, name);

	let revoke = () => {
		if (proxy) {
			revokeProxy(socket, proxy.source);
		}
	};

	const { on } = onEvent(socket, name);

	const ask = createAskResource(socket, {
		requester: {
			id: name,
			type: 'Handler',
		},
	});

	const instance = {
		use,
		on,
		sendMessage,
		resources: {
			removeResource,
			upsertResource,
		},
		proxy: {
			revoke,
		},
		ask,
	};
	return instance;
};
