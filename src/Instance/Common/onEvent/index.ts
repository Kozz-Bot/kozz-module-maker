import { UseFn } from '../../Handler';

// [TODO] Better type for this
type HandlerOrProxy = any;

type HandleOrProxyGetter = () => HandlerOrProxy;

export const onEvent = (instanceGetter: HandleOrProxyGetter) => {
	const moduleUseFns: UseFn[] = [];

	const use = (useFn: UseFn) => {
		moduleUseFns.push(useFn);
		return instanceGetter();
	};

	return {
		moduleUseFns,
		use,
	};
};
