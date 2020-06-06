import { handle } from "../handle";
import { registerEventListener } from "../../dom-tracking";
import { unwrap } from "../../operators";

type EventOptions = Record<string, Function>;

handle<EventOptions>("event", {
	onBind(value, node) {
		const [eventName, callback] = Object.entries(unwrap(value))[0];

		registerEventListener(node, eventName, (ev: Event) => {
			if (ev instanceof CustomEvent && ev.detail) {
				callback(ev.detail, ev);
			} else {
				callback(ev);
			}
		});
	}
});
