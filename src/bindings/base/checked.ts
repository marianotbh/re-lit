import { handle } from "../handle";
import { Observable } from "../../subscribables";
import { registerEventListener } from "../../dom-tracking";
import { unwrap } from "../../operators";

handle<boolean, HTMLInputElement>("checked", {
	onBind(value, node) {
		if (value instanceof Observable) {
			node.checked = Boolean(unwrap(value));
			registerEventListener(node, "change", () => {
				value.value = node.checked;
			});
		}
	},
	onUpdate(value, node) {
		node.checked = Boolean(unwrap(value));
	}
});
