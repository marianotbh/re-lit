import { handle } from "../handle";
import { Observable } from "../../subscribables";
import { registerEventListener } from "../../dom-tracking";
import { unwrap } from "../../operators";

handle<string | number, HTMLInputElement>("input", {
	onBind(accessor, node) {
		if (accessor instanceof Observable) {
			registerEventListener(node, "input", () => {
				accessor.value = node.value;
			});
		}
	},
	onUpdate(value, node) {
		node.value = unwrap(value).toString();
	}
});
