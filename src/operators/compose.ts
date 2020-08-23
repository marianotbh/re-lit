import { cause, effect } from "./effect";
import { ripple } from "./pool";
import { subscribe, publish, unsubscribe } from "./subscribe";

type EvaluatorFn<T = unknown> = () => T;

export type Composed<T = unknown> = {
	readonly value: T;
	subscribe(cb: (val: T) => void): void;
};

const COMPOSED_OBSERVABLE_SYMBOL = Symbol("COMPOSED_OBSERVABLE");

export function compose<T = unknown>(fn: EvaluatorFn<T>, executeImmediately: boolean = false): Composed<T> {
	let latestValue: T;
	let isPristine = true;

	function setValue(newValue: T) {
		if (newValue !== latestValue) {
			latestValue = newValue;
			publish(composed, latestValue);
		}
	}

	const composed = {
		get value(): T {
			cause(composed);

			if (isPristine) {
				isPristine = false;

				effect(() => {
					setValue(fn());
				});
			} else {
				setValue(fn());
			}

			return latestValue;
		},
		subscribe(cb: (val: T) => void) {
			subscribe(composed, cb);
			ripple(() => unsubscribe(composed, cb));
		}
	};

	Object.defineProperty(composed, COMPOSED_OBSERVABLE_SYMBOL, { value: true });

	if (executeImmediately) {
		const _ = composed.value;
	}

	return composed;
}

export function isComposed<T = unknown>(value: {}): value is Composed<T> {
	return Object.getOwnPropertyDescriptor(value, COMPOSED_OBSERVABLE_SYMBOL)?.value === true;
}
