import { touch } from "../dependency-detection";
import { Operator } from "./operator";

export class Observable<T = unknown> extends Operator<T> {
	protected latestValue: T;

	constructor(initialValue: T) {
		super();
		this.latestValue = initialValue;
	}

	get value(): T {
		touch(this);
		return this.latestValue;
	}

	set value(v: T) {
		if (this.latestValue !== v) {
			this.latestValue = v;
			this.publish(this.latestValue);
		}
	}

	peek(): T {
		return this.latestValue;
	}
}

export const observable = <T = unknown>(initialValue: T) => {
	return new Observable(initialValue);
};

export const isObservable = (value: any): value is Observable => {
	return value instanceof Observable;
};
