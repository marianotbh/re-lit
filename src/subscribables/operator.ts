import { Subscribable } from "./subscribable";

export abstract class Operator<T = unknown> extends Subscribable<T> {
	protected abstract latestValue: T;
	abstract get value(): T;
	abstract set value(val: T);

	peek(): T {
		return this.latestValue;
	}
}
