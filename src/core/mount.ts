import { trackDOM } from "../dom";

export function render(app: DocumentFragment, root: HTMLElement = document.body) {
	trackDOM(root);
	root.append(app);
}
