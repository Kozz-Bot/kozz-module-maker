import { type AskResourcePayload } from 'kozz-types';

type ResourceName = string;
type ResourceGetter = (args: AskResourcePayload['request']['data']) => any;

export type ResourceMap = {
	[key: ResourceName]: ResourceGetter;
};

export const createResourceMap = () => {
	const resourceMap: ResourceMap = {};

	const upsertResource = (name: ResourceName, getter: ResourceGetter) => {
		resourceMap[name] = getter;
	};

	const removeResource = (name: ResourceName) => {
		delete resourceMap[name];
	};

	return {
		resourceMap,
		upsertResource,
		removeResource,
	};
};
