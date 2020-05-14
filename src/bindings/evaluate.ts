import { BindingContext } from "./context";

const cache = new Map<string, Function>();

export function evaluate(expression: string, context: BindingContext) {
	try {
		let fn = cache.get(expression);

		if (typeof fn === "undefined") {
			const body = `with($context){with($this){return ${expression}}}`;
			fn = new Function("$context", "$this", body);
			cache.set(expression, fn);
		}

		return fn(context, context.vm);
	} catch (error) {
		throw new Error(`failed to evaluate expression "${expression}": ${error}`);
	}
}
