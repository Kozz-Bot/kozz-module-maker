import {
	ArrayTypeString,
	OptionalTypeString,
	PrimaryTypeString,
	TypeString,
} from '../Schema';

type TypeDescriptor<T extends TypeString> = {
	array: T extends ArrayTypeString ? true : false;
	optional: T extends OptionalTypeString ? true : false;
	type: T extends PrimaryTypeString
		? T
		: T extends `${infer Type}[]?`
		? Type
		: T extends `${infer Type}?`
		? Type
		: T extends `${infer Type}[]`
		? Type
		: never;
};

const typeIsArray = (type: TypeString): type is ArrayTypeString => {
	return type.includes('[]');
};

const typeIsOptional = (type: TypeString): type is OptionalTypeString => {
	return type.includes('?');
};

const toPrimitiveType = (type: TypeString): PrimaryTypeString => {
	if (type.includes('boolean')) {
		return 'boolean';
	}
	if (type.includes('number')) {
		return 'number';
	}
	return 'string';
};

export const describeType = <Type extends TypeString>(type: Type) =>
	({
		array: typeIsArray(type),
		optional: typeIsOptional(type),
		type: toPrimitiveType(type),
	} as TypeDescriptor<Type>);

export const isArgValid = <Type extends TypeString>(
	arg: unknown,
	typeDescriptor: TypeDescriptor<Type>
) => {
	if (arg === undefined && typeDescriptor.optional) {
		return true;
	}
	if (Array.isArray(arg) !== typeDescriptor.array) {
		return false;
	}
	if (Array.isArray(arg) && typeDescriptor.array && arg.length === 0) {
		return true;
	}
	if (Array.isArray(arg) && typeDescriptor.array && arg.length > 0) {
		return arg.reduce((valid, arg) => {
			return valid && typeof arg === typeDescriptor.type;
		}, true);
	}
	return typeof arg === typeDescriptor.type;
};

/**
 * Check ifm the arguments of a provided command are valid
 * @param args
 * @param descriptionMap
 * @returns
 */
export const isArgsObjectValid = <Type extends TypeString>(
	args: Record<string, unknown> = {},
	descriptionMap: Record<string, Type> = {}
) => {
	return Object.entries(descriptionMap).reduce((valid, [argName, argType]) => {
		if (!args || !args[argName]) {
			return false;
		}
		return valid && isArgValid(args[argName], describeType(argType));
	}, true);
};
