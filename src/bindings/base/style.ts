import { handle } from "../handle";
import { unwrap } from "../../operators";

handle<object, HTMLElement>("style", {
	onUpdate(value, node) {
		Object.entries(unwrap(value)).forEach(([propName, propValue]) => {
			node.style.setProperty(propName, unwrap(propValue), "important");
		});
	}
});
