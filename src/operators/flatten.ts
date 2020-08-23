import { Operator } from "./operator";
import { unwrap } from "./unwrap";

export function flatten<T extends object, U>(
	target: T
): {
	[K in keyof T]: T[K] extends Operator ? T[K]["value"] : T[K] extends () => any ? ReturnType<T[K]> : T[K];
} {
	return Object.fromEntries(Object.entries(target).map(([key, value]) => [key, unwrap(value)])) as {
		[K in keyof T]: T[K] extends Operator ? T[K]["value"] : T[K] extends () => any ? ReturnType<T[K]> : T[K];
	};
}
