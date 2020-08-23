import { cause } from "./effect";
import { ripple } from "./pool";
import { publish, subscribe, unsubscribe } from "./subscribe";

const OBSERVABLE_SYMBOL = Symbol("OBSERVABLE");

export type Observable<T = unknown> = {
	value: T;
	update(updater: T): T;
	update(updater: (latestValue: T) => T): T;
	peek(): T;
	subscribe(cb: (val: T) => void): void;
};

export function observe<T = unknown>(initialValue?: T): Observable<T> {
	let latestValue: T;

	if (initialValue) {
		latestValue = initialValue;
	}

	const observable = {
		get value(): T {
			cause(observable);
			return latestValue;
		},
		set value(newValue: T) {
			if (newValue !== latestValue) {
				latestValue = newValue;
				publish(observable, latestValue);
			}
		},
		update(updater: any) {
			if (typeof updater === "function") {
				observable.value = updater(latestValue);
			} else {
				observable.value = updater;
			}

			return latestValue;
		},
		peek() {
			return latestValue;
		},
		subscribe(cb: (val: T) => void) {
			subscribe(observable, cb);
			ripple(() => unsubscribe(observable, cb));
		}
	};

	Object.defineProperty(observable, OBSERVABLE_SYMBOL, { value: true });

	return observable;
}

export function isObservable<T = unknown>(value: {}): value is Observable<T> {
	return Object.getOwnPropertyDescriptor(value, OBSERVABLE_SYMBOL)?.value === true;
}
