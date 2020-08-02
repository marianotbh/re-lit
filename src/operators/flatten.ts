import { Operator } from "./operator";
import { unwrap } from "./unwrap";

export function flatten<T extends object>(
	target: T
): {
	[K in keyof T]: T[K] extends Operator ? T[K]["value"] : T[K];
} {
	return Object.fromEntries(
		Object.entries(target).map(([key, value]) => {
			return [key, unwrap(value)];
		})
	) as {
		[K in keyof T]: T[K] extends Operator ? T[K]["value"] : T[K];
	};
}
