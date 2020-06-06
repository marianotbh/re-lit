import { handle } from "../handle";
import { apply } from "../apply";
import { unwrap } from "../../operators";

type RouteParams = { name: string; params?: object };

handle<RouteParams, HTMLElement>("router", {
	controlsChildren: true,
	onBind() {
		globalThis.addEventListener("hashchange", () => {
			const { hash } = location;

			const component = hash;

			console.log("hash: " + component);
		});
	},
	onUpdate(value, node, context) {
		node.innerHTML = "";

		const { name, params = {} } = unwrap(value);

		apply(
			"component",
			node,
			() => ({
				name,
				params
			}),
			context
		);
	}
});
