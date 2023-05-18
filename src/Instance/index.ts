import { Command } from 'kozz-types/dist';
import { Method, MethodCreator, TypeString } from '../Schema';
import { connect } from '../Socket';

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
	const moduleUseFns: UseFn[] = [];

	const { socket, introduce, registerMethods } = connect(
		address,
		moduleUseFns,
		templatePath || ''
	);

	introduce(name, methods);
	// @ts-ignore
	registerMethods(methods);

	const use = (useFn: UseFn) => {
		moduleUseFns.push(useFn);
		return instance;
	};

	const instance = {
		use,
	};

	return instance;
};
