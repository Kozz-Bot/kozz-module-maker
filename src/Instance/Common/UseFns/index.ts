import { Command } from 'kozz-types';

// [TODO] Better type for this
type HandlerOrProxy = any;
type HandleOrProxyGetter = () => HandlerOrProxy;

export type UseFn = (args: Command) => Command;
export type OriginalFn = (args: Command) => any;

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
