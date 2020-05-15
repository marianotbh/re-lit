import { handle } from "../handle";
import { createComponent, isComponent } from "../../components/component";
import { ViewModel } from "../../components/vm";
import { bindChildren } from "../bind";
import { addDisposeCallback } from "../../dom-tracking";
import { createTemplate } from "../../components/template";
import { Params } from "../../components/params";
import { unwrap } from "../../operators";
import { setContext } from "../registry";

type ComponentBindingValue = {
	name: string;
	params: Params<{}>;
	alias: string | null;
};

function getSlot(node: HTMLElement): DocumentFragment | null {
	if (node.innerHTML.trim().length) {
		const slot = createTemplate(node.innerHTML);
		node.innerHTML = null;
		return slot;
	} else {
		return null;
	}
}

handle<ComponentBindingValue>("component", {
	controlsChildren: true,
	onBind(value, node, context) {
		if (node instanceof HTMLElement) {
			const { name, params = <Params>{}, alias = null } = unwrap(value);

			if (isComponent(name)) {
				const { template, viewModel } = createComponent(name);

				const slot = getSlot(node);
				params.slot = slot;
				context.slot = slot;

				if (typeof alias === "string" && alias.length) {
					const el = document.createElement(alias);
					el.append(template.cloneNode(true));
					node.parentElement.replaceChild(el, node);
					setContext(el, context);
					params.ref = el;
					context.ref = el;
				} else {
					node.append(template.cloneNode(true));
					params.ref = node;
					context.ref = node;
				}

				const vmInstance = viewModel(params);

				const componentContext = context.createChild(vmInstance);

				addDisposeCallback(context.ref, () => {
					if (vmInstance instanceof ViewModel) {
						vmInstance.onDispose();
					} else if (typeof vmInstance.dispose === "function") {
						vmInstance.dispose();
					}
				});

				bindChildren(context.ref, componentContext, true);
			} else {
				console.warn(`"${name}" is not defined as a component, handler will be ignored`);
			}
		} else {
			throw new Error(`cannot handle "component" on non-HTMLElement`);
		}
	}
});
