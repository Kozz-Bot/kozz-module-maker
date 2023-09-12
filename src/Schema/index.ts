import { MessageObj } from '../Message';

export type PrimaryTypeString = 'string' | 'number' | 'boolean';
export type ArrayTypeString =
	| `${PrimaryTypeString}[]`
	| `${PrimaryTypeString}[]?`;

export type OptionalTypeString =
	| `${ArrayTypeString}?`
	| `${PrimaryTypeString}?`;

export type TypeString =
	| PrimaryTypeString
	| ArrayTypeString
	| OptionalTypeString;

export type StringTypeVariants =
	| 'string'
	| 'string[]'
	| 'string[]?'
	| 'string?';

export type NumberTypeVariants =
	| 'number'
	| 'number[]'
	| 'number[]?'
	| 'number?';

export type BooleanTypeVariants =
	| 'boolean'
	| 'boolean[]'
	| 'boolean[]?'
	| 'boolean?';

type ToPrimary<T extends TypeString> = T extends StringTypeVariants
	? string
	: T extends NumberTypeVariants
	? number
	: T extends BooleanTypeVariants
	? boolean
	: never;

type ToArray<T extends ArrayTypeString> = T extends ArrayTypeString
	? ToPrimary<T>[]
	: ToPrimary<T>;

type ToOptional<T extends OptionalTypeString> = T extends ArrayTypeString
	? ToArray<T> | undefined
	: T extends OptionalTypeString
	? ToPrimary<T> | undefined
	: T extends PrimaryTypeString
	? ToPrimary<T>
	: never;

type TypeFromString<T extends TypeString> = T extends never
	? never
	: T extends OptionalTypeString
	? ToOptional<T>
	: T extends ArrayTypeString
	? ToArray<T>
	: T extends PrimaryTypeString
	? ToPrimary<T>
	: T extends string
	? never
	: never;

export type MethodCreator = <
	const T extends { [key: string]: TypeString },
	const Name extends string
>(
	name: Name,
	callback: (
		requester: MessageObj,
		args: { [key in keyof T]: TypeFromString<T[key]> }
	) => any,
	args?: T
) => MethodMap<Name, T>;

/**
 * Creates a method that can be inserted to any Command handler.
 * @param {{ [key: string]: TypeString }} commandArgs
 * @returns {Method}
 */
// @ts-ignore
export const createMethod: MethodCreator = (name, callback, args) => {
	return {
		[name]: {
			args,
			func: callback,
		} as const,
	};
};

export type Method<T extends { [key: string]: TypeString }> = {
	readonly args: T;
	readonly func: (
		message: MessageObj,
		args: { [key in keyof T]: TypeFromString<T[key]> }
	) => void;
};

export type MethodMap<
	Name extends string,
	T extends { [key: string]: TypeString }
> = {
	[key in `${Name}`]: Method<T>;
};
