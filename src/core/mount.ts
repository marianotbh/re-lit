import { trackDOM } from "../dom-tracking";
import { Template } from "./pesos";

export function mount(thing: Template | (() => Template)) {
	const template = typeof thing === "function" ? thing() : thing;

	return {
		on: async (root: HTMLElement) => {
			while (root.firstChild) {
				root.removeChild(root.firstChild);
			}

			trackDOM(root);

			const result = await template.render();

			root.append(result);
		}
	};
}
