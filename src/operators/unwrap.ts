import { Operator } from "../operators/operator";

export function unwrap<T = unknown>(something: T | Operator<T>): T {
	if (something instanceof Operator) {
		return something.value;
	} else {
		return something;
	}
}
