import { BindingContext } from "./context";
import { Operator } from "src/subscribables";

type HandlerEventHandler<TValue = unknown, TNode extends Node = Node> = (
	value: TValue | Operator<TValue>,
	node: TNode,
	context: BindingContext
) => void;

export type Handler<TValue = unknown, TNode extends Node = Node> = {
	controlsChildren?: boolean;
	preventsEvaluation?: boolean;
	onBind?: HandlerEventHandler<TValue, TNode>;
	onUpdate?: HandlerEventHandler<TValue, TNode>;
};

const handlers = new Map<string, Handler>();
const literalHandlers = new Set<string>();

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

	if (handler.preventsEvaluation) {
		literalHandlers.add(name);
	}

	handlers.set(name, <object>handler);
}

export function isHandled(name: string): boolean {
	return handlers.has(name);
}

export function getHandler(name: string): Handler | null {
	return handlers.get(name) ?? null;
}

export function shouldEvaluate(name: string) {
	return !literalHandlers.has(name);
}
