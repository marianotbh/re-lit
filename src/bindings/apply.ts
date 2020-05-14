import { BindingContext } from "./context";
import { getHandler } from "./handle";
import { computed, unwrap } from "../operators";
import { addDisposeCallback } from "../dom-tracking";
import { Operator } from "../subscribables";

type ValueAccessor<T = unknown> = () => T;

const appliedHandlers = new WeakMap<Node, Set<string>>();

export async function apply(
	bindingName: string,
	node: Node,
	accessor: ValueAccessor,
	context: BindingContext = new BindingContext({})
): Promise<boolean> {
	const handler = getHandler(bindingName);

	let shouldBreak = false;

	if (handler !== null) {
		const { onBind, onUpdate, controlsChildren } = handler;

		const accessedValue = accessor();

		let bindingValue: Operator<typeof accessedValue>;

		if (accessedValue instanceof Operator) {
			bindingValue = accessedValue;
		} else {
			const computedValue = computed<typeof accessedValue>(accessor);

			addDisposeCallback(node, () => {
				computedValue.dispose();
			});

			bindingValue = computedValue;
		}

		if (typeof onBind !== "undefined") {
			onBind(bindingValue, node, context);
		}

		if (typeof onUpdate !== "undefined") {
			onUpdate(bindingValue, node, context);

			bindingValue
				.subscribe(_ => {
					onUpdate(bindingValue, node, context);
				})
				.attach(node);
		}

		if (controlsChildren) {
			shouldBreak = true;
		}

		registerHandler(node, bindingName);
	}

	return shouldBreak;
}

function registerHandler(node: Node, handler: string) {
	if (appliedHandlers.has(node)) {
		appliedHandlers.get(node).add(handler);
	} else {
		const handlers = new Set<string>([handler]);
		appliedHandlers.set(node, handlers);
	}
}

export function handlersFor(node: Node) {
	return [...appliedHandlers.get(node)?.values()];
}
