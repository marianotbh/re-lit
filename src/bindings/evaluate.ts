import { BindingContext } from "./context";

const cache = new Map<string, Function>();

export function evaluate(expression: string, context: BindingContext): () => any {
	if (cache.has(expression)) {
		const fn = cache.get(expression)!;
		return () => fn(context, context.vm);
	} else {
		const body = `with($context){with($this){return ${expression}}}`;
		const fn = new Function("$context", "$this", body);
		cache.set(expression, fn);
		return () => fn(context, context.vm);
	}
}
