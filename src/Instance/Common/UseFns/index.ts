import { type Command } from 'kozz-types';

// [TODO] Better type for this
type HandlerOrProxy = any;
type HandleOrProxyGetter = () => HandlerOrProxy;

export type UseFn = (args: Command) => Command;
export type OriginalFn = (args: Command) => any;

export const createUseFns = (instanceGetter: HandleOrProxyGetter) => {
	const moduleUseFns: UseFn[] = [];

	/**
	 * Add the named arg "abort" with any value to the `command.namedArgs` payload in order
	 * to abort the run of the function;
	 * @param useFn
	 * @returns
	 */
	const use = (useFn: UseFn) => {
		moduleUseFns.push(useFn);
		return instanceGetter();
	};

	return {
		moduleUseFns,
		use,
	};
};
