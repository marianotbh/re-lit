import { handle } from "../handle";
import { unwrap } from "../../operators";

handle<string>("text", {
	onUpdate(value, node) {
		if ("textContent" in node) {
			node.textContent = unwrap(value);
		}
	}
});
