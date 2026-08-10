import type { Method, TypeString } from '../../Schema';
import { createResourceMap, createUseFns, onEvent } from '../Common';
import { connect } from '../../Socket';
import { revokeProxy } from '../../Socket/Events/Emit/RevokeProxy';
import {
	type ProxyConfig,
	requestProxy,
} from '../../Socket/Events/Emit/RequestProxy';
import { type CommandAlias } from 'kozz-types';
import { onAskResource } from '../../Socket/Events/Handle/AskResource';
import { sendMessageToContact } from '../../Message/RoutineCreation/SendMessage';
import { createAskResource } from '../../Message/RoutineCreation/AskResource';
import { introduce } from '../../Socket/Events/Emit/Introduction';
import { onProxiedMessages } from '../../Socket/Events/Handle/ProxiedMessage';

export type ControllerInitParams<Methods extends Record<string, TypeString>> = {
	name: string;
	namespace?: string;

	address: string;
	customSocketPath?: string;

	templatePath?: string;
	signature?: string;

	commands?: {
		boundariesToHandle: string[];
		methods?: Record<string, Method<Methods>>;
		aliases?: CommandAlias[];
	};

	proxy?: ProxyConfig | ProxyConfig[];
};

export const createModule = <Methods extends Record<string, TypeString>>({
	name,
	address,
	commands,
	proxy,
	signature,
	templatePath,
	customSocketPath,
	namespace = process.env.KOZZ_NAMESPACE || process.env.NAMESPACE || 'default',
}: ControllerInitParams<Methods>) => {
	const { moduleUseFns, use } = createUseFns(() => instance);
	const proxies = proxy ? (Array.isArray(proxy) ? proxy : [proxy]) : [];
	let removeProxiedMessagesListener = () => {};

	const { socket, registerMethods } = connect(
		() => {
			console.log(
				`Introducing ${name} to gateway on address ${address} with socketPath ${customSocketPath} in namespace ${namespace}`
			);
			introduce(
				socket,
				name,
				commands?.methods || {},
				commands?.aliases,
				namespace,
				signature
			);
			if (proxies.length) {
				removeProxiedMessagesListener();
				removeProxiedMessagesListener = onProxiedMessages(socket, proxies, name);
				proxies.forEach(proxyConfig => {
					requestProxy(socket, {
						address,
						name,
						...proxyConfig,
					})
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
		proxies.forEach(proxyConfig =>
			revokeProxy(socket, proxyConfig.source, proxyConfig.subscriber || name)
		);
	};

	const { on } = onEvent(socket, name);

	const ask = createAskResource(socket, {
		requester: {
			id: name,
			type: 'Handler',
			namespace,
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
