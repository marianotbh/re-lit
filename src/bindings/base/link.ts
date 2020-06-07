import { handle } from "../handle";
import { registerEventListener } from "../../dom-tracking";
import router from "../../routing";

handle<any, HTMLElement>("link", {
	onBind(_, node, context) {
		registerEventListener(node, "click", () => {
			const path = node.getAttribute("to");

			if (path === null) {
				throw new Error("link element is missing a 'to' attribute");
			}

			router.go(path);
		});
	}
});
