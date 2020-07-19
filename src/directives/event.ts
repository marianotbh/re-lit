import { addDisposeCallback } from "../dom-tracking";

type EventHandler = (ev: Event) => void;

export function event(node: Node) {
	debugger;
	return function (name: string, handler: EventHandler) {
		debugger;
		node.addEventListener(name, handler);

		addDisposeCallback(node, () => {
			node.removeEventListener(name, handler);
		});
	};
}
