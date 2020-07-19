import { trackDOM } from "../dom-tracking";
import { Template } from "./pesos";

export async function mount(root: HTMLElement, template: Template) {
	while (root.firstChild) {
		root.removeChild(root.firstChild);
	}

	trackDOM(root);

	const result = template.render();

	root.append(result);
}
