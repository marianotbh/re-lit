import { BindingContext } from "./context";
import { getHandler, registerHandler } from "./handle";
import { computed } from "../operators";
import { addDisposeCallback } from "../dom-tracking";

export async function apply(
	handlerName: string,
	node: Node,
	accessor: (() => any) | null,
	context: BindingContext
) {
	const handler = getHandler(handlerName);

	if (handler !== null) {
		const { onBind, onUpdate } = handler;

		const valueAccesor = computed(accessor !== null ? accessor : () => null);

		addDisposeCallback(node, valueAccesor.dispose);

		if (typeof onBind !== "undefined") {
			onBind(valueAccesor.value, node, context);
		}

		if (typeof onUpdate !== "undefined") {
			onUpdate(valueAccesor.value, node, context);

			valueAccesor
				.subscribe(value => {
					onUpdate(value, node, context);
				})
				.attach(node);
		}

		registerHandler(node, handlerName);
	}
}
