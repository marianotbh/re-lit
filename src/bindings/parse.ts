import { getHandler, registerHandler } from "./handle";
import { BindingContext } from "./context";
import { evaluate } from "./evaluate";
import { addDisposeCallback } from "../dom-tracking";
import { computed } from "../operators";

export function parse(handlerName: string, expression: string, context: BindingContext) {
	const handler = getHandler(handlerName);

	if (handler !== null) {
		const { onBind, onUpdate, controlsChildren = false, evaluatesExpression = true } = handler;

		return async function (node: Node) {
			let value: () => any;

			if (evaluatesExpression) {
				value = evaluate(expression, context);
			} else {
				value = () => expression;
			}

			const valueAccesor = computed(value);

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

			addDisposeCallback(node, () => valueAccesor.dispose());
			registerHandler(node, handlerName);

			return controlsChildren;
		};
	} else {
		return null;
	}
}
