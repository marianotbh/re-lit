import { BindingContext } from "./context";

const registry = new WeakMap<Node, BindingContext>();

export function setContext(node: Node, context: BindingContext): void {
	registry.set(node, context);
}

export function getContext<TContext extends object = object>(
	node: Node
): BindingContext<TContext> | null {
	return (registry.get(node) as BindingContext<TContext>) ?? null;
}

export function hasContext(node: Node): boolean {
	return registry.has(node);
}
