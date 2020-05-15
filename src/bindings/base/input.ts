import { handle } from "../handle";
import { Observable } from "../../subscribables";
import { addDisposeCallback } from "../../dom-tracking";
import { unwrap } from "../../operators";

handle<string | number, HTMLInputElement>("input", {
	onBind(value, node) {
		if (value instanceof Observable) {
			const listener = () => {
				value.value = node.value;
			};

			node.addEventListener("input", listener, false);

			addDisposeCallback(node, () => {
				node.removeEventListener("input", listener, false);
			});
		}
	},
	onUpdate(value, node) {
		node.value = unwrap(value).toString();
	}
});
