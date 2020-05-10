import { BindingContext } from "./context";

const cache = new Map<string, Function>();

export function evaluate(expression: string, context: BindingContext) {
	let fn = cache.get(expression);

	if (typeof fn === "undefined") {
		const body = `with($context){with($this){return ${expression}}}`;
		fn = new Function("$context", "$this", body);
		cache.set(expression, fn);
	}

	return fn(context, context.vm);
}
