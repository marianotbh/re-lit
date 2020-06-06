import { handle } from "../handle";
import { unwrap } from "../../operators";
import { evaluate } from "../evaluate";
import { createTemplate } from "../../components";
import { bind } from "../bind";
import { isArrayOperator } from "../../subscribables";

handle<string, HTMLElement>("for", {
	controlsChildren: true,
	evaluatesExpression: true,
	onBind(value, node, context) {
		const [prop, alias] = unwrap(value)
			.split("as")
			.map(s => s.trim());

		const result = evaluate(prop, context)();
		const iterable = unwrap(result);

		if (Array.isArray(iterable)) {
			const template = createTemplate(node.innerHTML);

			if (template.childElementCount != 1) {
				throw new Error(`cannot handle "for" on elements with more than 1 child`);
			}

			node.innerHTML = "";
			iterable.forEach(item => {
				const el = template.firstElementChild!.cloneNode(true) as HTMLElement;
				const ctxt = context.createChild(item, el);

				if (typeof alias === "string" && alias.length) {
					ctxt.set(alias, item);
				}

				node.append(el);
				bind(el, ctxt);
			});

			if (isArrayOperator<object>(result)) {
				result
					.subscribe(val => {
						node.innerHTML = "";
						val.forEach(item => {
							const el = template.firstElementChild!.cloneNode(true) as HTMLElement;
							const ctxt = context.createChild(item, el);

							if (typeof alias === "string" && alias.length) {
								ctxt.set(alias, item);
							}

							node.append(el);
							bind(el, ctxt);
						});
					})
					.attach(node);
			}
		} else {
			throw new Error(`cannot handle "for" for non-array values`);
		}
	}
});
