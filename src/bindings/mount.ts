import { BindingContext } from "./context";
import { bind } from "./bind";
import { trackDOM } from "../dom-tracking";

export async function mount(root: Node, data: object) {
	const context = BindingContext.from(data);
	trackDOM(root);
	await bind(root, context, true);
}
