import { observable, Observable } from "../operators/observable";

export function map<T extends object = object>(
	target: T
): {
	[key in keyof T]: T[key] extends Function ? never : Observable<T[key]>;
} {
	return Object.fromEntries(
		Object.entries(target).map(([key, value]) =>
			typeof value !== "function" ? ([key, observable(value)] as const) : []
		)
	);
}
