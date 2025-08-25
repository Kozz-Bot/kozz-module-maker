import {
	bold,
	code,
	italic,
	listItem,
	monospace,
	paragraph,
	stroke,
} from 'src/InlineCommands';
import { type Component } from '.';

export const createTemplatingComponent =
	(command: (text: string) => string): Component<{}> =>
	({ children }) => {
		return typeof children === 'string'
			? `${command(children)}`
			: Array.isArray(children)
			? `${command(children.join(''))}`
			: children?.toString();
	};

export const Bold = createTemplatingComponent(bold);
export const Code = createTemplatingComponent(code);
export const Monospace = createTemplatingComponent(monospace);
export const Stroke = createTemplatingComponent(stroke);
export const Italic = createTemplatingComponent(italic);
export const ListItem = createTemplatingComponent(listItem);
export const Paragraph = createTemplatingComponent(paragraph);

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
