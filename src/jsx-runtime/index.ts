// mini-jsx-string/index.ts

// ----------------- Types -----------------
export type Primitive = string | number;
export type Nullable = null | undefined | boolean;

export type Child = VNode<any> | Primitive | Nullable | Child[];

export type Component<P = {}> = (props: P & { children?: Child }) => Child;

export type Type<P = any> = string | symbol | Component<P>;

export interface VNode<P = any> {
	type: Type<P>;
	props: (P & { children?: Child }) | { children?: Child };
}

export type IntrinsicRenderer<P = any> = (props: P, children: string) => string;
export type IntrinsicsMap = Record<string, IntrinsicRenderer<any>>;

export interface RenderOptions {
	intrinsics?: IntrinsicsMap;
}

// ----------------- Element creation -----------------
export const Fragment = Symbol.for('mini-jsx.fragment');

export function createElement<P>(
	type: Type<P>,
	props: (P & { children?: Child }) | null,
	...children: Child[]
): VNode<P> {
	const nextProps: any = props ? { ...props } : {};
	if (children.length) {
		nextProps.children = children.length === 1 ? children[0] : children;
	}
	return { type, props: nextProps };
}

// Automatic runtime entry points (@babel/preset-react runtime: 'automatic')
export function jsx<P>(type: Type<P>, props: P | null, key?: string | number) {
	const p: any = props || {};
	if (key != null) p.key = key;
	return renderNode({ type, props: p });
}
export const jsxs = jsx;

export function jsxDEV<P>(
	type: Type<P>,
	props: P | null,
	key?: string | number,
	_isStaticChildren?: boolean,
	_source?: any,
	_self?: any
): VNode<P> {
	const p: any = props || {};
	if (key != null) p.key = key;
	return { type, props: p };
}

function renderNode(node: Child): string {
	if (node == null || node === false || node === true) return '';

	if (typeof node === 'string' || typeof node === 'number') return String(node);

	if (Array.isArray(node)) {
		return node.map(n => renderNode(n)).join('');
	}

	// VNode
	const { type, props = {} as any } = node as VNode<any>;

	// Function component
	if (typeof type === 'function') {
		const rendered = (type as Component<any>)({
			...(props as any),
			children: (props as any).children,
		});
		return renderNode(rendered as Child);
	}

	// Fragment
	if (type === Fragment) {
		return props.children
			.map((childNode: Child) => renderNode(childNode))
			.join('\n')
			.trim();
	}

	// Intrinsic "tag" (string) -> reduce to text using mapping (or pass-through)
	if (typeof type === 'string') {
		const childrenText = renderNode((props as any).children as Child);
		return childrenText;
	}

	return '';
}

export * from './MessageTemplating';
