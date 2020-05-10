import { isComponent } from "../components";
import { toCamel } from "../utils";

type AttributeBindingExpression = [string, string];

function isAttributeBindingExpression(
	obj: AttributeBindingExpression | null
): obj is AttributeBindingExpression {
	return obj !== null;
}

export function process(node: Node): AttributeBindingExpression[] | null {
	const processed = new Array<AttributeBindingExpression>();

	if (node instanceof HTMLElement) {
		if (isComponent(node)) {
			const name = node.tagName.toLowerCase();
			const params = getParams([...node.attributes]);
			const expression = `{ name: "${name}", params: ${params} }`;
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

export function getParams(attrs: Attr[]): string {
	return `{${attrs
		.filter(attr => attr.name.startsWith("$"))
		.map(attr => {
			const name = toCamel(attr.name.replace("$", ""));
			const value = `${attr.value ? `: ${attr.value}` : ""}`;
			return name + value;
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
