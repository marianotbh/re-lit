import { Observable, isObservable } from "./observe";
import { Composed, isComposed } from "./compose";

export type Operator<T = unknown> = Observable<T> | Composed<T>;

export function isOperator<T = unknown>(value: {}): value is Operator<T> {
	return isComposed(value) || isObservable(value);
}
