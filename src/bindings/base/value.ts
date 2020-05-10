import { handle } from "../handle";
import { Operator } from "../../subscribables";
import { addDisposeCallback } from "../../dom-tracking";

handle<string | number, HTMLInputElement>("value", {
	onBind(value, node) {
		if (value instanceof Operator) {
			node.value = typeof value.value === "string" ? value.value : value.value.toString();

			const listener = () => {
				value.value = node.value;
			};

			node.addEventListener("change", listener, false);

			addDisposeCallback(node, () => {
				node.removeEventListener("change", listener, false);
			});
		} else {
			node.value = typeof value === "string" ? value : value.toString();
		}
	},
	onUpdate(value, node) {
		if (value instanceof Operator) {
			node.value = typeof value.value === "string" ? value.value : value.value.toString();
		} else {
			node.value = typeof value === "string" ? value : value.toString();
		}
	}
});
