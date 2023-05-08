/**
 * This type system was adapted from the following page:
 * https://stackoverflow.com/questions/60862509/typescript-types-from-array-to-object
 */

type ToObject<T> = T extends readonly [infer Key, infer type]
	? Key extends PropertyKey
		? { [P in Key]: type }
		: never
	: never;

type ToObjectsArray<T> = {
	[I in keyof T]: ToObject<T[I]>;
};

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I
) => void
	? I
	: never;

// @ts-ignore
type NamedArgs<ArrayArgs> = UnionToIntersection<ToObjectsArray<ArrayArgs>[number]>;

type BaseCommand = {
	method: string;
	immediateArg?: string;
	namedArgs: Record<string, any>;
	message: any;
	boundaryId: string;
};

type CustomCommand<Method extends string, T> = BaseCommand & {
	method: Method;
	namedArgs: NamedArgs<T>;
};

export type Method<Method extends string, T> = {
	method: Method;
	namedArgs: NamedArgs<T>;
};

export const arrayToObject = <Args extends ReadonlyArray<any>>(args: Args) => {
	const result: any = {};

	for (const [name, arg] of args) {
		result[name] = arg;
	}

	return result as NamedArgs<Args>;
};

export const createHandlerInstance = () => {
	let command: BaseCommand = {
		boundaryId: '',
		message: '',
		method: '',
		namedArgs: {},
		immediateArg: '',
	};

	const availableCommands: CustomCommand<any, any>[] = [];

	const addMethod = <Name extends string, Args>(
		methodName: Name,
		namedArgs: NamedArgs<Args>
	) => {
		const method: Method<Name, Args> = {
			method: methodName,
			namedArgs,
		};
		availableCommands.push({
			...command,
			...method,
		} as CustomCommand<Name, NamedArgs<Args>>);
	};

	return {
		addMethod,
		availableCommands,
	};
};

type PrimitiveType = 'string' | 'number' | 'boolean';
type ArrayType = `${PrimitiveType}[]`;
type OptionalType = `${PrimitiveType}?` | `${ArrayType}?`;
type Type = PrimitiveType | OptionalType | ArrayType | ObjectType;
type ObjectType = {
	[key: string]: Type;
};

const isArray = (type: Type): type is ArrayType => {
	return typeof type === 'string' && type.includes('[]');
};

const isOptional = (type: Type): type is OptionalType => {
	return typeof type === 'string' && type.endsWith('?');
};

type TypeDescriptor = {
	type: string | Record<string, TypeDescriptor>;
	array: boolean;
	optional: boolean;
};

export const typeChecker = (type: Type): TypeDescriptor => {
	if (typeof type === 'object') {
		return Object.entries(type).reduce((acc, [key, value]): TypeDescriptor => {
			return {
				...acc,
				[key]: typeChecker(value),
			};
		}, {} as TypeDescriptor);
	}

	return {
		type: type.match(/([^\[\]?])+/)![0],
		array: isArray(type),
		optional: isOptional(type),
	};
};
