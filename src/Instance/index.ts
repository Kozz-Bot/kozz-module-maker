import {
	CustomCommand,
	Method,
	MethodCreator,
	MethodFn,
	MethodParams,
	MethodParamsDescriptor,
	MethodWithName,
	NamedArgs,
} from '../Schema';
import { ToPrimitive, Type, typeChecker, TypeDescriptor } from '../Validator';
import { connect } from '../Socket';

type HandlerInitParams = {
	address: string;
};

export const createHandlerInstance = ({ address }: HandlerInitParams) => {
	// List that will hold the methods
	const availableCommands: CustomCommand<string, Record<string, Type>> = {};

	const getAllCommands = (): MethodWithName<Record<string, Type>>[] => {
		return Object.entries(availableCommands).map(([key, value]) => ({
			method: value.method,
			namedArgs: value.namedArgs,
			methodName: key,
		}));
	};

	const getCommandByName = <Name extends string>(name: Name) => {
		return availableCommands[name];
	};

	const { socket, introduce } = connect(address);

	/**
	 * Adds a new method to the module. It also communicates with the
	 * gateway letting it know about the new method.
	 * @param methodName
	 * @param namedArgs
	 * @param method
	 */
	const addMethod: MethodCreator = ({ args, func, name }) => {
		introduce('test-lib', getAllCommands());
	};

	return {
		addMethod,
		getCommandByName,
	};
};
