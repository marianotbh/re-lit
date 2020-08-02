import { Subscribable } from "./subscribable";

export abstract class Operator<T = unknown> extends Subscribable<T> {
	protected latestValue: T | undefined;
	abstract get value(): T;
	abstract set value(val: T);

	/**
	 * reads the observable's latest value without triggering any dependency detection features
	 */
	peek(): T | undefined {
		return this.latestValue;
	}
}

export function isOperator<T = unknown>(value: any): value is Operator<T> {
	return value instanceof Operator;
}

export function isArrayOperator<TItem = unknown>(value: any): value is Operator<TItem[]> {
	return value instanceof Operator && Array.isArray(value.peek());
}
