import { handle } from "../handle";
import { Observable } from "../../subscribables";
import { registerEventListener } from "../../dom-tracking";
import { unwrap } from "../../operators";

handle<string | number, HTMLInputElement>("value", {
	onBind(value, node) {
		if (value instanceof Observable) {
			registerEventListener(node, "change", () => {
				value.value = node.value;
			});
		}
	},
	onUpdate(value, node) {
		node.value = unwrap(value).toString();
	}
});
