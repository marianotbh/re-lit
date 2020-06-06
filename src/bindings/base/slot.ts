import { handle } from "../handle";
import { unwrap } from "../../operators";
import { bindChildren } from "../bind";

handle<string, HTMLElement>("slot", {
	controlsChildren: true,
	onBind(value, node, context) {
		const slotName = unwrap(value);

		const { slot } = context;

		if (slot !== null) {
			let el = slot.cloneNode(true);

			if (slotName) {
				const children = [...el.childNodes];
				const found = children
					.filter((el): el is HTMLElement => el instanceof HTMLElement)
					.find(el => el.tagName.toLowerCase() === slotName);
				if (typeof found !== "undefined") {
					el = found;
				}
			}

			node.innerHTML = "";

			node.append(el);

			bindChildren(node, context);
		} else {
			throw new Error("context has no slot");
		}
	}
});
