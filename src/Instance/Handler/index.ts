import { Command } from 'kozz-types/dist';
import { Method, TypeString } from '../../Schema';
import { connect } from '../../Socket';
import { onAskResource } from '../../Socket/Events/Handle/AskResource';
import { createResourceMap, createUseFns } from '../Common/';
import { sendMessageToContact } from '../../Message/RoutineCreation/SendMessage';

export type HandlerInitParams<Methods extends Record<string, TypeString>> = {
	name: string;
	address: string;
	methods: Record<string, Method<Methods>>;
	boundariesToHandle: string[];
	templatePath?: string;
	signature?: string;
};

export type UseFn = (args: Command) => Command;
export type OriginalFn = (args: Command) => any;

export const createHandlerInstance = <
	Methods extends Record<string, TypeString>
>({
	address,
	methods,
	name,
	templatePath,
	signature,
	boundariesToHandle,
}: HandlerInitParams<Methods>) => {
	const { moduleUseFns, use } = createUseFns(() => instance);

	const { socket, registerMethods } = connect(
		address,
		moduleUseFns,
		templatePath || '',
		name,
		methods,
		boundariesToHandle,
		signature
	);

	registerMethods(methods);

	const { removeResource, resourceMap, upsertResource } = createResourceMap();
	onAskResource(socket, resourceMap);

	const sendMessage = sendMessageToContact(socket, name);

	const instance = {
		use,
		sendMessage,
		resources: {
			removeResource,
			upsertResource,
		},
	};

	return instance;
};
