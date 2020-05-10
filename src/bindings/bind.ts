import { BindingContext } from "./context";
import { process } from "./process";
import { evaluate } from "./evaluate";
import { apply } from "./apply";
import { setContext } from "./registry";

export async function bind(
	node: Node,
	context: BindingContext,
	recursive: boolean = true
): Promise<void> {
	const processed = process(node);

	if (processed !== null) {
		const shouldBreak = await Promise.all(
			processed.map(([name, expression]) => {
				const value = evaluate(expression, context);
				const valueAccessor = () => value;
				return apply(name, node, valueAccessor, context);
			})
		);

		if (shouldBreak.includes(true)) {
			recursive = false;
		}
	}

	setContext(node, context);

	if (recursive) {
		await bindChildren(node, context, true);
	}
}

export async function bindChildren(node: Node, context: BindingContext, recursive: boolean = true) {
	if (node.hasChildNodes()) {
		return Promise.all(
			[...node.childNodes].map(childeNode => {
				bind(childeNode, context, recursive);
			})
		);
	}
}
