import { handle } from "../handle";
import { unwrap } from "../../operators";

type Option = { text: string; value: string; label?: string; disabled?: boolean };
type Group = { [group: string]: Array<string | Option> };
type Options = Array<string | Option> | Group;

handle<Options, HTMLElement>("options", {
	onUpdate(value, node) {
		const options = unwrap(value);

		if (node instanceof HTMLSelectElement) {
			node.innerHTML = "";
			if (Array.isArray(options)) {
				options.forEach(item => {
					if (typeof item === "object") {
						const { text, value, label, disabled } = item;
						const option = createOption(text, value, label, disabled);
						node.append(option);
					} else {
						const option = createOption(item);
						node.append(option);
					}
				});
			} else {
				Object.entries(options).forEach(([label, opt]) => {
					const optgroup = createGroup(label);
					node.append(optgroup);
					if (Array.isArray(opt)) {
						opt.forEach(item => {
							if (typeof item === "object") {
								const { text, value, label, disabled } = item;
								const option = createOption(text, value, label, disabled);
								node.append(option);
							} else {
								const option = createOption(item);
								node.append(option);
							}
						});
					}
				});
			}
		} else {
			throw new Error(`options can only be used on HTMLSelectElements`);
		}
	}
});

const createOption = (
	text: string,
	value?: string,
	label?: string,
	disabled: boolean = false
): HTMLOptionElement => {
	const option = document.createElement("option");
	option.textContent = text;
	if (value) option.value = value;
	if (label) option.label = label;
	if (disabled) option.disabled = disabled;
	return option;
};

const createGroup = (label: string): HTMLOptGroupElement => {
	const optgroup = document.createElement("optgroup");
	optgroup.label = label;
	return optgroup;
};
