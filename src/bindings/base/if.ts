import { handle } from "../handle";
import { Operator } from "../../subscribables";
import { bindChildren } from "../bind";

handle<boolean, HTMLElement>("if", {
	controlsChildren: true,
	onBind(value, node, context) {
		if (value instanceof Operator) {
			const innerHTML = node.innerHTML;
			value.subscribe(val => {
				if (val && !node.innerHTML) {
					node.innerHTML = innerHTML;
					bindChildren(node, context, true);
				} else {
					node.innerHTML = "";
				}
			});

			if (value.value && !node.innerHTML) {
				node.innerHTML = innerHTML;
				bindChildren(node, context, true);
			} else {
				node.innerHTML = "";
			}
		} else {
			if (!value) {
				node.innerHTML = "";
			}
		}
	}
});
