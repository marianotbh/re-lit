import { handle } from "../handle";
import { unwrap } from "../../operators";

handle<{ [key: string]: string | number | boolean }, HTMLElement>("attr", {
	onUpdate(value, node) {
		const [attrName, attrValue] = Object.entries(unwrap(value))[0];

		node.setAttribute(attrName, unwrap(attrValue).toString());
	}
});
