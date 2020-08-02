import { isOperator, Operator } from "../operators/operator";
import { addDisposeCallback } from "../dom-tracking";
import { computed, observable, flatten } from "../operators";
import { event as addEvent, text as setText, attr as setAttr } from "../directives";
import { dispose } from "../dependency-detection";

const isToken = (str: string) => /{{([0-9]*)}}/.test(str.toUpperCase());

function queue(callback: () => void) {
	if (typeof globalThis.queueMicrotask !== "function") {
		setTimeout(callback, 0);
	} else {
		queueMicrotask(callback);
	}
}

type PossibleValue =
	| string
	| number
	| object
	| ((ev: Event) => void)
	| ((el: Element) => void)
	| Operator<string | number>
	| (() => Template | null | Array<Template>)
	| Template;

export default function (
	templateStringsArray: TemplateStringsArray,
	...args: Array<PossibleValue>
): Template {
	return new Template(templateStringsArray, ...args);
}

function createTemplateFromString(innerHTML: string) {
	const template = document.createElement("template");
	template.innerHTML = innerHTML;
	return document.importNode(template.content, true);
}

export class Template {
	private templateStringsArray: TemplateStringsArray;
	private args: Array<PossibleValue>;
	private parts: Map<number, PossibleValue>;
	private deps: Set<() => void>;

	constructor(templateStringsArray: TemplateStringsArray, ...args: Array<PossibleValue>) {
		this.templateStringsArray = templateStringsArray;
		this.args = args;
		this.parts = new Map();
		this.deps = new Set();
	}

	dispose(deps: Array<() => void>) {
		deps.forEach(dep => this.deps.add(dep));
		return this;
	}

	render<T extends Node = Element>(): T {
		let el: Node;

		if (this.args.length > 0) {
			const innerHTML = this.args
				.reduce((str: string, arg, idx) => {
					this.parts.set(idx, arg);
					return (str += `{{${idx}}}${this.templateStringsArray[idx + 1]}`);
				}, this.templateStringsArray[0])
				.trim();

			if (innerHTML === "{{0}}") {
				el = document.createTextNode(innerHTML);
				queue(() => {
					this.processNode(el);
					if (this.deps.size > 0) {
						addDisposeCallback(el, () => this.deps.forEach(dep => dep()));
					}
				});
			} else {
				const template = createTemplateFromString(innerHTML);

				if (template.childElementCount > 1 || template.firstElementChild === null) {
					throw new Error("templates should contain a single parent node");
				}

				el = template.firstElementChild;

				queue(() => {
					this.processNode(el);
					if (this.deps.size > 0) {
						addDisposeCallback(el, () => this.deps.forEach(dep => dep()));
					}
				});
			}
		} else {
			const innerHTML = this.templateStringsArray.join("").trim();
			el = createTemplateFromString(innerHTML);
		}

		return el as T;
	}

	private processNode(node: Node) {
		if (node instanceof HTMLElement) {
			this.processHTMLElement(node);
			// recursively process node's child nodes
			Array.from(node.childNodes).map(child => this.processNode(child));
		} else if (node instanceof Text) {
			this.processText(node);
		}
	}

	private processHTMLElement(node: HTMLElement) {
		const attributes = Array.from(node.attributes);

		attributes.forEach(attr => {
			// evaluates <div ${{ id: '123' }} ></div> like attributes
			if (isToken(attr.name)) {
				const token = attr.name.toUpperCase();
				const value = this.getPart(token.replace("{{", "").replace("}}", ""));

				if (typeof value === "object") {
					const apply = setAttr(node);
					const ref = computed(() => flatten(value as Record<string, string | null>));
					ref.subscribe(v => apply(v));
					this.deps.add(() => {
						dispose(ref);
						ref.dispose();
					});
					ref.force();
					attr.ownerElement!.removeAttribute(attr.name);
				} else if (typeof value === "function") {
					(value as (el: Element) => void)(node);
					attr.ownerElement!.removeAttribute(attr.name);
				} else {
					throw new Error("invalid attribute object");
				}
			} else {
				if (isToken(attr.value)) {
					if (attr.name.startsWith("on")) {
						const token = attr.value;
						const name = attr.name.substr(2);
						const value = this.getPart(token.replace("{{", "").replace("}}", ""));

						if (typeof value === "function") {
							addEvent(node)(name, value as (ev: Event) => void);
							attr.ownerElement!.removeAttribute(attr.name);
						} else {
							throw Error("invalid event listener");
						}
					} else {
						const { name, value: token } = attr;
						const value = this.getPart(token.replace("{{", "").replace("}}", ""));
						if (name in node) {
							(node as any)[name] = value;
						} else {
							throw Error(`invalid property '${name}' for node`);
						}
					}
				}
			}
		});
	}

	private processText(node: Text) {
		const matches = node.textContent!.matchAll(/{{([0-9]*)}}/g);

		if (matches !== null) {
			let remainder = node;

			Array.from(matches).forEach(([token, value]) => {
				const newNode = remainder.splitText(remainder.textContent!.indexOf(token));
				remainder = newNode.splitText(newNode.textContent!.indexOf(token) + token.length);

				const part = this.getPart(value);

				// evaluates passed template objects
				if (part instanceof Template) {
					const template = part.render();
					newNode.replaceWith(template);
				}

				// evaluates functions
				else if (typeof part === "function") {
					const open = document.createComment("");
					const close = document.createComment("");

					newNode.replaceWith(open, close);

					const ref = computed(part as () => Template | Array<Template> | null);

					ref.subscribe(async v => {
						if (v === null) {
							while (open.nextSibling !== close) {
								open.nextSibling?.remove();
							}
						} else if (v instanceof Template) {
							const template = v.render();

							while (open.nextSibling !== close) {
								open.nextSibling?.remove();
							}

							open.parentNode!.insertBefore(template, close);
						} else if (Array.isArray(v)) {
							while (open.nextSibling !== close) {
								open.nextSibling?.remove();
							}

							v.forEach(t => {
								open.parentNode!.insertBefore(t.render(), close);
							});
						}
					});

					this.deps.add(() => {
						dispose(ref);
						ref.dispose();
					});

					ref.force();
				}

				// evaluates text
				else {
					const apply = setText(newNode);

					if (isOperator(part)) {
						const sub = part.subscribe(v => apply(v));
						apply(part.value);
						this.deps.add(() => part.unsubscribe(sub));
					} else {
						apply(part);
					}
				}
			});
		}
	}

	private getPart(key: string | number) {
		return this.parts.get(Number(key)) as PossibleValue;
	}
}
