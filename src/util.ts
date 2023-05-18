import { Command } from 'kozz-types';
import { UseFn } from './Instance';

export const runUse = (useArr: UseFn[], args: Command) => {
	return useArr.reduce((res, fn) => {
		return fn(res);
	}, args);
};

export function normalizeString(string: string) {
	return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
