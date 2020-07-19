import { addDisposeCallback } from "../dom-tracking";

type EventHandler = (ev: Event) => void;

export function event(node: Node) {
	return function (name: string, handler: EventHandler) {
		node.addEventListener(name, handler);

		addDisposeCallback(node, () => {
			node.removeEventListener(name, handler);
		});
	};
}
