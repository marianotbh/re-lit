import { subscribe } from "./subscribe";

type Effect = () => void;

const scopes: Array<Effect> = [];

const relationships = new WeakMap<Effect, Set<{}>>();

export function effect(fn: Effect) {
	if (scopes.includes(fn)) {
		throw new Error("circular dependency detected");
	}

	if (!relationships.has(fn)) {
		relationships.set(fn, new Set());
	}

	scopes.unshift(fn);

	fn();

	scopes.shift();
}

export function cause(dep: {}): void {
	const currentEffect = scopes[0];

	if (currentEffect && !relationships.get(currentEffect)?.has(dep)) {
		subscribe(dep, _ => currentEffect());
	}
}
