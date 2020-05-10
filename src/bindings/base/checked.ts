import { handle } from "../handle";
import { Operator } from "../../subscribables";
import { addDisposeCallback } from "../../dom-tracking";
import { unwrap } from "../../operators";

handle<boolean, HTMLInputElement>("checked", {
	onBind(value, node) {
		if (value instanceof Operator) {
			node.checked = Boolean(value.value);

			const listener = () => {
				value.value = node.checked;
			};

			node.addEventListener("change", listener, false);

			addDisposeCallback(node, () => {
				node.removeEventListener("change", listener, false);
			});
		} else {
			node.checked = Boolean(value);
		}
	},
	onUpdate(value, node) {
		node.checked = Boolean(unwrap(value));
	}
});
