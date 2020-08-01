import { trackDOM } from "../dom-tracking";
import { Template } from "./pesos";

export function mount(templateCreator: () => Template) {
	return {
		on: (root: HTMLElement) => {
			while (root.firstChild) {
				root.removeChild(root.firstChild);
			}

			trackDOM(root);

			const result = templateCreator().render();

			root.append(result);
		}
	};
}
