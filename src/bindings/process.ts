import { isComponent } from "../components/component";
import { toCamel } from "../utils";
import { isHandled } from "./handle";

type AttributeBindingExpression = [string, string];

function isAttributeBindingExpression(
	obj: AttributeBindingExpression | null
): obj is AttributeBindingExpression {
	return obj !== null;
}

export function process(node: Node): AttributeBindingExpression[] | null {
	const processed = new Array<AttributeBindingExpression>();

	if (node instanceof HTMLElement) {
		const tagName = node.tagName.toLowerCase();

		if (isComponent(tagName)) {
			const params = getParams([...node.attributes]);
			const expression = `{ name: "${tagName}", params: ${params} }`;
			processed.push(["component", expression]);
		}

		if (node.attributes.length) {
			processed.push(...[...node.attributes].map(getBindings).filter(isAttributeBindingExpression));
		}
	} else if (node instanceof Text) {
		if (/\{\{(.*?)\}\}/.test(node.textContent)) {
			processed.push(["interpolate", "null"]);
		}
	}

	return processed.length ? processed : null;
}

export function getOptions(attrs: Attr[]): string {
	return `{${attrs
		.map(({ name, value }) => {
			return name + (value ? `: ${value}` : "");
		})
		.join(", ")
		.trim()}}`;
}

export function getParams(attrs: Attr[]): string {
	return `{${attrs
		.filter(attr => attr.name.startsWith("$"))
		.map(({ name, value }) => {
			return toCamel(name.replace("$", "")) + (value ? `: ${value}` : "");
		})
		.join(", ")
		.trim()}}`;
}

export function getBindings(attr: Attr): AttributeBindingExpression | null {
	if (attr.name.startsWith(":")) {
		return [attr.name.substr(1), attr.value];
	} else if (attr.name.startsWith("@")) {
		return ["event", `{ ${attr.name.substr(1)}: ${attr.value} }`];
	} else {
		return null;
	}
}
