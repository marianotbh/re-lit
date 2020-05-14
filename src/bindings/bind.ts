import { BindingContext } from "./context";
import { batch } from "./batch";
import { evaluate } from "./evaluate";
import { apply } from "./apply";
import { setContext, hasContext } from "./registry";
import { shouldEvaluate } from "./handle";

export async function bind(
	node: Node,
	context: BindingContext,
	recursive: boolean = true
): Promise<void> {
	if (hasContext(node)) {
		throw new Error("cannot bind context to an already bound node");
	}

	const processed = batch(node);

	if (processed !== null) {
		const shouldBreak = await Promise.all(
			processed.map(([name, expression]) => {
				const value = shouldEvaluate(name) ? evaluate(expression, context) : expression;
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
