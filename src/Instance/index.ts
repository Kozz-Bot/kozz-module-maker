import { Method, MethodCreator, TypeString } from '../Schema';
import { connect } from '../Socket';

type HandlerInitParams<Methods extends Record<string, TypeString>> = {
	name: string;
	address: string;
	methods: Record<string, Method<Methods>>;
};

export const createHandlerInstance = <
	Methods extends Record<string, TypeString>
>({
	address,
	methods,
	name,
}: HandlerInitParams<Methods>) => {
	const { socket, introduce, registerMethods } = connect(address);

	introduce(name, methods);
	// @ts-ignore
	registerMethods(methods);

	const instance = {};
	return instance;
};
