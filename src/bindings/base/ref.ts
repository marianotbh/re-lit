import { handle } from "../handle";
import { unwrap } from "../../operators";

handle<Function>("ref", {
	onBind(value, node, context) {
		const callback = unwrap(value);

		if (typeof callback !== "function") {
			throw new Error("ref value must be a valid callback function");
		}

		callback(node, context);
	}
});
