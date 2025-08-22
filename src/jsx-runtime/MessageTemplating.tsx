import { type Component } from '.';

const createTemplatingComponent =
	(markup: string): Component<{}> =>
	({ children }) => {
		return typeof children === 'string'
			? `${markup}${children}${markup}`
			: Array.isArray(children)
			? `${markup}${children.join('')}${markup}`
			: children?.toString();
	};

export const Bold = createTemplatingComponent('*');
export const Code = createTemplatingComponent('```');
export const Line = createTemplatingComponent('');
export const Monospace = createTemplatingComponent('`');
export const Stroke = createTemplatingComponent('~');
export const Italic = createTemplatingComponent('_');

export const List = ({ items }: { items: string | string[] }) => {
	if (typeof items === 'string') return `- ${items}`;
	return items.map(item => `- ${item}`).join('\n');
};

/**
 * Conditionally renders it's children if the prop 'when' evaluates to true
 * @param param0
 * @returns
 */
export const Render: Component<{ when: boolean | (() => boolean) }> = ({
	when,
	children,
}) => {
	const shouldRender = typeof when === 'boolean' ? when : when();

	if (shouldRender) {
		return children;
	} else {
		return null;
	}
};

type ForEachProps<TData> = {
	data: Readonly<TData[]>;
	render: (data: TData, index: number) => Component<any>;
};

/**
 * Iterates over an array and renders a component for each item.
 * @param props
 * @returns
 */
export const ForEach = <TData extends any>(props: ForEachProps<TData>) => {
	return (props.data ?? []).map(
		(data, index) => props.render(data, index) + '\n'
	);
};
