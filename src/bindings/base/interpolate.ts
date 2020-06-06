import { handle } from "../handle";
import { evaluate } from "../evaluate";
import { apply } from "../apply";

const mustacheMatcher = /\{\{(.*?)\}\}/g;

handle<string, Text>("interpolate", {
	controlsChildren: true,
	onBind(_, node, context) {
		const matches = node.textContent?.match(mustacheMatcher) ?? null;

		if (matches != null) {
			let remainder = node;
			matches.forEach(match => {
				const newNode = remainder.splitText(remainder.textContent!.indexOf(match));
				remainder = newNode.splitText(newNode.textContent!.indexOf("}}") + 2);

				const expression = newNode.textContent!.replace("{{", "").replace("}}", "");
				const accessor = evaluate(expression, context);

				apply("text", newNode, accessor, context);
			});
		}
	}
});
