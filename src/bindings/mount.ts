import { BindingContext } from "./context";
import { bind } from "./bind";
import { trackDOM } from "../dom-tracking";

export async function mount(root: HTMLElement, data: object = {}) {
	const context = BindingContext.from(data);
	context.ref = root;
	trackDOM(root);
	await bind(root, context, true);
}
