import { isOperator, Operator } from "../operators/operator";
import { Subscription } from "../operators/subscription";
import { addDisposeCallback } from "../dom-tracking";
import { computed, observable, snap } from "../operators";
import { event, text, attr } from "../directives";
import { Computed } from "../operators/computed";

const TEMPLATE_TOKEN = "__TEMPLATE_TOKEN_";

const isToken = (str: string) => /__TEMPLATE_TOKEN_([0-9]*)__/.test(str.toUpperCase());

export default function (
	templateStringsArray: TemplateStringsArray,
	...args: Array<unknown>
): Template {
	return new Template(templateStringsArray, ...args);
}

export class Template {
	private templateStringsArray: TemplateStringsArray;
	private args: any[];
	private parts: Map<string, any>;
	private deps: Set<Subscription | Computed>;

	constructor(templateStringsArray: TemplateStringsArray, ...args: Array<unknown>) {
		this.templateStringsArray = templateStringsArray;
		this.args = args;
		this.parts = new Map();
		this.deps = new Set();
	}

	render() {
		if (this.args.length + 1 !== this.templateStringsArray.length)
			throw new Error("unbalanced template");

		const innerHTML =
			this.args.length > 0
				? this.args.reduce((str, arg, idx) => {
						const token = `__TEMPLATE_TOKEN_${idx}__`;
						this.parts.set(token, arg);
						str += `${token}${this.templateStringsArray[idx + 1]}`;
						return str;
				  }, this.templateStringsArray[0])
				: this.templateStringsArray.join("");

		const template = document.createElement("template");
		template.innerHTML = innerHTML;

		const node = document.importNode(template.content, true);

		this.processContent(node);

		if (this.deps.size > 0) {
			addDisposeCallback(node, () => {
				this.deps.forEach(dep => {
					dep.dispose();
				});
			});
		}

		return node;
	}

	private processContent(content: DocumentFragment) {
		const children = Array.from(content.children);
		children.forEach(child => {
			this.processNode(child);
		});
	}

	private processNode(node: Node) {
		if (node instanceof HTMLElement) {
			this.processHTMLElement(node);
		} else if (node instanceof Text) {
			this.processText(node);
		}

		node.childNodes.forEach(child => this.processNode(child));
	}

	private processHTMLElement(node: HTMLElement) {
		const attrs = Array.from(node.attributes);

		attrs.forEach(a => {
			if (a.name.startsWith("on") && isToken(a.value)) {
				const token = a.value;
				const name = a.name.substr(2);
				const value = this.getPart<() => void>(token);
				event(node)(name, value);
				a.ownerElement!.removeAttribute(a.name);
			} else if (isToken(a.name)) {
				const token = a.name.toUpperCase();
				const value = this.getPart<{}>(token);

				if (typeof value === "object") {
					const apply = attr(node);
					const ref = computed(() => snap(value));
					const sub = ref.subscribe(v => apply(v));
					ref.update();
					this.deps.add(sub);
					this.deps.add(ref);
					a.ownerElement!.removeAttribute(a.name);
				} else if (typeof value === "function") {
					value(node);
					a.ownerElement!.removeAttribute(a.name);
				} else {
					throw new Error("invalid attribute directive");
				}
			}
		});
	}

	private getPart<T = unknown>(key: string): T {
		return this.parts.get(key) as T;
	}

	private processText(node: Text) {
		if (node.textContent && node.textContent.includes(TEMPLATE_TOKEN)) {
			const matches = node.textContent!.match(/__TEMPLATE_TOKEN_([a-z0-9-]*)__/g);

			if (matches != null) {
				let remainder = node;

				matches.forEach(token => {
					const newNode = remainder.splitText(remainder.textContent!.indexOf(token));
					remainder = newNode.splitText(newNode.textContent!.indexOf(token) + token.length);

					const part = this.getPart<
						| string
						| number
						| Operator<string | number>
						| (() => Template | null | Array<Template>)
						| Template
					>(token);

					// evaluates passed template objects
					if (part instanceof Template) {
						const template = part.render();
						newNode.parentNode!.replaceChild(template, newNode);
					}

					// evaluates functions
					else if (typeof part === "function") {
						const open = document.createComment("");
						const close = document.createComment("");
						newNode.replaceWith(open, close);

						const ref = computed(part);

						const sub = ref.subscribe(v => {
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

								v.map(t => t.render()).forEach(t => {
									open.parentNode!.insertBefore(t, close);
								});
							}
						});

						ref.update();

						this.deps.add(sub);
						this.deps.add(ref);
					}

					// evaluates text
					else {
						const apply = text(newNode);

						if (isOperator(part)) {
							const sub = part.subscribe(v => apply(v));
							apply(part.value);
							this.deps.add(sub);
						} else {
							apply(part);
						}
					}
				});
			}
		}
	}
}
