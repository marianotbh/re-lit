import { effect, flatten, isObservable, unwrap } from "..";
import { isOperator } from "../operators/operator";
import { subscribe } from "../operators/subscribe";

export function html(templateLiteral: TemplateStringsArray, ...args: any[]) {
	const [html, parts] = processTemplateStrings(templateLiteral, ...args);

	const template = createTemplateFromString(html);

	Array.from(template.childNodes).forEach(childNode => processNode(childNode, parts));

	return template;
}

function createTemplateFromString(innerHTML: string) {
	const template = document.createElement("template");
	template.innerHTML = innerHTML;
	return document.importNode(template.content, true);
}

function processTemplateStrings(strings: TemplateStringsArray, ...args: any[]) {
	const parts = new Map<number, any>();
	const innerHTML = args
		.reduce((str: string, arg, idx) => {
			parts.set(idx, arg);
			return (str += `{{${idx}}}${strings[idx + 1]}`);
		}, strings[0])
		.trim();

	return [innerHTML, parts] as const;
}

async function processNode(node: Node, parts: Map<number, any>) {
	if (node instanceof HTMLElement) {
		if (node.attributes.length) {
			Array.from(node.attributes).forEach(attribute => processAttributeNode(attribute, parts));
		}

		if (node.hasChildNodes()) {
			Array.from(node.childNodes).map(childNode => processNode(childNode, parts));
		}
	} else if (node instanceof Text && node.textContent) {
		processTextNode(node, parts);
	}
}

function processAttributeNode(attributeNode: Attr, parts: Map<number, any>) {
	if (/{{([0-9]*)}}/.test(attributeNode.name)) {
		const part = getPart(attributeNode.name, parts);

		if (typeof part === "function") {
			part(attributeNode.ownerElement!);
			attributeNode.ownerElement!.removeAttribute(attributeNode.name);
		} else if (typeof part === "object") {
			const parent = attributeNode.ownerElement!;

			effect(() => {
				Object.entries(flatten(part)).forEach(([name, value]) => {
					if (value === null) {
						parent.removeAttribute(name);
					} else {
						if (parent.hasAttribute(name)) {
							if (parent.getAttribute(name) !== value) {
								parent.setAttribute(name, value);
							}
						} else {
							parent.setAttribute(name, value);
						}
					}
				});
			});

			attributeNode.ownerElement!.removeAttribute(attributeNode.name);
		}
	} else if (/{{([0-9]*)}}/.test(attributeNode.value)) {
		const part = getPart(attributeNode.value, parts);

		if (attributeNode.name.startsWith("on")) {
			if (typeof part !== "function") {
				throw new Error(
					`invalid event callback for ${attributeNode.name} - ${String(part)} ${
						attributeNode.ownerElement!.outerHTML
					} `
				);
			}

			const event = attributeNode.name.substr(2);

			attributeNode.ownerElement!.addEventListener(event, part);
			attributeNode.ownerElement!.removeAttribute(attributeNode.name);
		} else {
			if (attributeNode.name in attributeNode.ownerElement!) {
				const setProp = (propName: string, propValue: {}) => {
					(attributeNode.ownerElement! as any)[propName] = propValue;
				};

				if (isObservable(part)) {
					subscribe<string>(part, value => setProp(attributeNode.name, value));
				}

				setProp(attributeNode.name, unwrap(part));
			} else {
				throw new Error(
					`${attributeNode.name} is not a valid property for ${attributeNode.ownerElement!.tagName}`
				);
			}
		}
	}
}

function getPart(token: string, parts: Map<number, any>): any {
	const index = Number(token.replace("{{", "").replace("}}", ""));
	return parts.get(index);
}

function processTextNode(textNode: Text, parts: Map<number, any>) {
	if (/{{([0-9]*)}}/.test(textNode.textContent!)) {
		const matches = textNode.textContent!.matchAll(/{{([0-9]*)}}/g);

		if (matches !== null) {
			let remainder = textNode;

			Array.from(matches).forEach(([token, value]) => {
				const newNode = remainder.splitText(remainder.textContent!.indexOf(token));
				remainder = newNode.splitText(newNode.textContent!.indexOf(token) + token.length);

				const part = getPart(value, parts);

				// evaluates passed template objects
				if (part instanceof DocumentFragment) {
					newNode.replaceWith(part);
				}

				// evaluates functions
				else if (typeof part === "function") {
					const open = document.createComment("");
					const close = document.createComment("");

					newNode.replaceWith(open, close);

					effect(() => {
						const result: null | DocumentFragment | DocumentFragment[] = part();

						if (result === null) {
							while (open.nextSibling !== close) open.nextSibling?.remove();
						} else if (result instanceof DocumentFragment) {
							while (open.nextSibling !== close) open.nextSibling?.remove();
							open.parentNode!.insertBefore(result, close);
						} else if (Array.isArray(result)) {
							while (open.nextSibling !== close) open.nextSibling?.remove();
							result.forEach(f => {
								open.parentNode!.insertBefore(f, close);
							});
						}
					});
				}

				// evaluates text
				else {
					const setText = (text: string) => (newNode.textContent = text);

					if (isOperator<string>(part)) {
						subscribe<string>(part, value => setText(String(value)));
					}

					setText(String(unwrap(part)));
				}
			});
		}
	}
}

function queue(callback: () => void) {
	if (typeof globalThis.queueMicrotask !== "function") {
		setTimeout(callback, 0);
	} else {
		queueMicrotask(callback);
	}
}
