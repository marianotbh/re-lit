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

handle<ComponentBindingValue>("component", {
	controlsChildren: true,
	onBind(value, node, context) {
		if (node instanceof HTMLElement) {
			const { name, params = {}, alias = null } = unwrap(value);

			if (isComponent(name)) {
				const { template, viewModel } = createComponent(name)!;

				let ref: HTMLElement, slot: DocumentFragment | null;

				if (typeof alias === "string" && alias.length) {
					ref = document.createElement(alias);
					node.parentElement!.replaceChild(ref, node);
					setContext(ref, context);
				} else {
					ref = node;
				}

				if (node.innerHTML.trim().length) {
					slot = createTemplate(node.innerHTML);
					node.innerHTML = "";
				} else {
					slot = null;
				}

				ref.append(template.cloneNode(true));

				const vmInstance = viewModel({ ...params, ref, slot });
				const componentContext = context.createChild(vmInstance, ref);

				addDisposeCallback(ref, () => {
					if (vmInstance instanceof ViewModel) {
						vmInstance?.onDispose?.();
					} else if (typeof vmInstance.dispose === "function") {
						vmInstance.dispose();
					}
				});

				bindChildren(ref, componentContext, true);
			} else {
				console.warn(`"${name}" is not defined as a component, handler will be ignored`);
			}
		} else {
			throw new Error(`cannot handle "component" on non-HTMLElement`);
		}
	}
});
