import { handle } from "../handle";
import { unwrap } from "../../operators";

handle<Function>("ref", {
	onBind(value, node, context) {
		const callback = unwrap(value);

		if (typeof callback !== "function") {
			throw new Error("Invalid value provided to :ref handler is not a valid callback");
		}

		callback(node, context);
	}
});
