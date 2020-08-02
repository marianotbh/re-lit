import { trackDOM } from "../dom-tracking";
import { Template } from "./pesos";

export function mount(app: Template) {
	return {
		on: (root: HTMLElement) => {
			while (root.firstChild) {
				root.removeChild(root.firstChild);
			}

			trackDOM(root);

			const result = app.render();

			root.append(result);
		}
	};
}
