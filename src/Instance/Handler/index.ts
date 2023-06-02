import { Command } from 'kozz-types/dist';
import { Method, TypeString } from '../../Schema';
import { connect } from '../../Socket';
import { onAskResource } from '../../Socket/Events/Handle/AskResource';
import { createResourceMap, createUseFns } from '../Common/';

type HandlerInitParams<Methods extends Record<string, TypeString>> = {
	name: string;
	address: string;
	methods: Record<string, Method<Methods>>;
	templatePath?: string;
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
}: HandlerInitParams<Methods>) => {
	const { moduleUseFns, use } = createUseFns(() => instance);

	const { socket, registerMethods } = connect(
		address,
		moduleUseFns,
		templatePath || '',
		name,
		methods
	);
	// @ts-ignore
	registerMethods(methods);

	const { removeResource, resourceMap, upsertResource } = createResourceMap();
	onAskResource(socket, resourceMap);

	const instance = {
		use,
		resources: {
			removeResource,
			upsertResource,
		},
	};

	return instance;
};
