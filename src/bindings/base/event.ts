import { handle } from "../handle";
import { addDisposeCallback } from "../../dom-tracking";
import { unwrap } from "../../operators";

type EventOptions = Record<string, EventListenerOrEventListenerObject>;

handle<EventOptions>("event", {
	onBind(value, node) {
		const [eventName, listener] = Object.entries(unwrap(value))[0];

		node.addEventListener(eventName, listener, false);

		addDisposeCallback(node, () => {
			removeEventListener(eventName, listener, false);
		});
	}
});
