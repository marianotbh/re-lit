import { isOperator, Operator } from "./operator";

export function unwrap<T = unknown>(something: Operator<T>): T;
export function unwrap<T = unknown>(something: () => T): T;
export function unwrap<T = unknown>(something: T): T;
export function unwrap<T = unknown>(something: {}): T {
	if (isOperator<T>(something)) {
		return something.value;
	} else if (typeof something === "function" && something.length === 0) {
		return something();
	} else {
		return something as T;
	}
}
