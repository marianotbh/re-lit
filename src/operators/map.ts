import { observe, Observable } from "./observe";

type MapOf<T extends object> = {
	[K in keyof Pick<
		T,
		{
			[Key in keyof T]: T[Key] extends Function ? never : Key;
		}[keyof T]
	>]: Observable<T[K]>;
};

export function map<T extends object = object>(target: T): MapOf<T> {
	return Object.fromEntries(
		Object.entries(target).map(([key, value]) => (typeof value !== "function" ? [key, observe(value)] : []))
	);
}
