import { handle } from "../handle";
import { Observable } from "../../subscribables";
import { addDisposeCallback } from "../../dom-tracking";
import { unwrap } from "../../operators";

handle<string | number, HTMLInputElement>("value", {
	onBind(value, node) {
		if (value instanceof Observable) {
			const listener = () => {
				value.value = node.value;
			};

			node.addEventListener("change", listener, false);

			addDisposeCallback(node, () => {
				node.removeEventListener("change", listener, false);
			});
		}
	},
	onUpdate(value, node) {
		node.value = unwrap(value).toString();
	}
});
