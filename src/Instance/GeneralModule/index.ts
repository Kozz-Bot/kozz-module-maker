import type { Method, TypeString } from '../../Schema';
import { createResourceMap, createUseFns, onEvent } from '../Common';
import { connect } from '../../Socket';
import { revokeProxy } from '../../Socket/Events/Emit/RevokeProxy';
import { requestProxy } from '../../Socket/Events/Emit/RequestProxy';
import { type ProxiedMessageObject } from '../../Message/ProxiedMessage';
import { type Source } from 'kozz-types';
import { onAskResource } from '../../Socket/Events/Handle/AskResource';
import { sendMessageToContact } from '../../Message/RoutineCreation/SendMessage';
import { createAskResource } from '../../Message/RoutineCreation/AskResource';
import { introduce } from '../../Socket/Events/Emit/Introduction';
import { onProxiedMessage } from '../../Socket/Events/Handle/ProxiedMessage';

export type ControllerInitParams<Methods extends Record<string, TypeString>> = {
	name: string;

	address: string;
	customSocketPath?: string;

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
		keepAliveProxy?: boolean;
	};
};

export const createModule = <Methods extends Record<string, TypeString>>({
	name,
	address,
	commands,
	proxy,
	signature,
	templatePath,
	customSocketPath,
}: ControllerInitParams<Methods>) => {
	const { moduleUseFns, use } = createUseFns(() => instance);

	const { socket, registerMethods } = connect(
		() => {
			console.log(
				`Introducing ${name} to gateway on address ${address} with socketPath ${customSocketPath}`
			);
			introduce(socket, name, commands?.methods || {}, signature);
			if (proxy) {
				onProxiedMessage(socket, proxy.source, proxy.onMessage);
				requestProxy(socket, {
					address,
					name,
					...proxy,
				});
			}
		},
		address,
		moduleUseFns,
		templatePath || '',
		name,
		commands?.boundariesToHandle || [],
		customSocketPath
	);

	if (commands?.methods) {
		registerMethods(commands?.methods);
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
		socket,
	};

	return instance;
};
