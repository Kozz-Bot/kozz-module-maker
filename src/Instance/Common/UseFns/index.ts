import { UseFn } from '../../Handler';

type HandlerOrProxy = any;

type HandleOrProxyGetter = () => HandlerOrProxy;

export const createUseFns = (instanceGetter: HandleOrProxyGetter) => {
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
