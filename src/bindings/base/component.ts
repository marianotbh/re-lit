import { handle } from "../handle";
import { createComponent, isComponent } from "../../components";
import { ViewModel } from "../../components/vm";
import { bindChildren } from "../bind";
import { addDisposeCallback } from "../../dom-tracking";
import { createTemplate } from "../../components/template";
import { Params } from "../../components/params";
import { unwrap } from "../../operators";

type ComponentBindingValue = {
	name: string;
	params: Params<{}>;
};

handle<ComponentBindingValue>("component", {
	controlsChildren: true,
	onUpdate(value, node, context) {
		if (!(node instanceof HTMLElement)) {
			throw new Error("component handler can only be applied on HTMLElement");
		}

		const { name, params = <Params>{} } = unwrap(value);

		if (isComponent(name)) {
			const { template, viewModel } = createComponent(name);

			params.ref = node;

			if (node.innerHTML.trim().length) {
				const slot = createTemplate(node.innerHTML);
				params.slot = slot;
				node.innerHTML = null;
			} else {
				params.slot = null;
			}

			node.append(template.cloneNode(true));

			if (typeof viewModel !== "undefined") {
				const vmInstance = viewModel(params);

				const componentContext = context.createChild(vmInstance);

				addDisposeCallback(node, () => {
					if (vmInstance instanceof ViewModel) {
						vmInstance.onDispose();
					} else if (typeof vmInstance.dispose === "function") {
						vmInstance.dispose();
					}
				});

				bindChildren(node, componentContext, true);
			} else {
				const componentContext = context.createChild(params);

				bindChildren(node, componentContext, true);
			}
		}
	}
});
