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

type TypeFromString<T extends TypeString> = T extends OptionalTypeString
	? ToOptional<T>
	: T extends ArrayTypeString
	? ToArray<T>
	: T extends PrimaryTypeString
	? ToPrimary<T>
	: never;

export type MethodCreator = <
	const T extends { [key: string]: TypeString },
	const Name extends string
>(args: {
	name: Name;
	args: T;
	func: (args: { [key in keyof T]: TypeFromString<T[key]> }) => void;
}) => MethodMap<Name, T>;

// @ts-ignore
export const createMethod: MethodCreator = ({ name, args, func }) => ({
	[name]: {
		args,
		func,
	} as const,
});

export type Method<T extends { [key: string]: TypeString }> = {
	readonly args: T;
	readonly func: (args: { [key in keyof T]: TypeFromString<T[key]> }) => void;
};

export type MethodMap<
	Name extends string,
	T extends { [key: string]: TypeString }
> = {
	[key in `${Name}`]: Method<T>;
};
