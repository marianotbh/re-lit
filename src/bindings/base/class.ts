import { handle } from "../handle";
import { unwrap } from "../../operators";

handle<object | string, HTMLElement>("class", {
	onUpdate(value, node, context) {
		const className = unwrap(value);

		if (typeof className === "object") {
			if (className !== null) {
				Object.entries(className).forEach(([name, value]) => {
					node.classList.toggle(name, Boolean(value));
				});
			}
		} else {
			className.split(" ").forEach(name => {
				node.classList.add(name);
			});
		}
	}
});
