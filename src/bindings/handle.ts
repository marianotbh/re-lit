import { BindingContext } from "./context";
import { Operator } from "../subscribables";

type HandlerEventHandler<TValue = unknown, TNode extends Node = Node> = (
	value: TValue | Operator<TValue>,
	node: TNode,
	context: BindingContext
) => void;

export type Handler<TValue = unknown, TNode extends Node = Node> = {
	controlsChildren?: boolean;
	evaluatesExpression?: boolean;
	unwrapAccesor?: boolean;
	onBind?: HandlerEventHandler<TValue, TNode>;
	onUpdate?: HandlerEventHandler<TValue, TNode>;
};

const handlers = new Map<string, Handler>();
const appliedHandlers = new WeakMap<Node, Set<string>>();

export function handle<TValue = unknown, TNode extends Node = Node>(
	name: string,
	handler: Handler<TValue, TNode>
): void {
	if (
		/[^a-z-]/g.test(name) ||
		name.startsWith("-") ||
		name.endsWith("-") ||
		name.includes(" ") ||
		name.includes("--")
	)
		throw new Error("Invalid handler name");

	handlers.set(name, <object>handler);
}

export function isHandled(name: string): boolean {
	return handlers.has(name);
}

export function getHandler(name: string): Handler | null {
	return handlers.get(name) ?? null;
}

export function registerHandler(node: Node, handler: string) {
	if (appliedHandlers.has(node)) {
		appliedHandlers.get(node)!.add(handler);
	} else {
		appliedHandlers.set(
			node,
			new Set<string>([handler])
		);
	}
}

export function handlersFor(node: Node) {
	return appliedHandlers.has(node) ? [...appliedHandlers.get(node)!.values()] : null;
}
