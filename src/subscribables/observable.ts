import { capture } from "../dependency-detection";
import { Operator } from "./operator";

export class Observable<T = unknown> extends Operator<T> {
	protected latestValue: T;

	constructor(initialValue: T) {
		super();
		this.latestValue = initialValue;
	}

	get value(): T {
		capture(this);
		return this.latestValue;
	}

	set value(v: T) {
		if (this.latestValue !== v) {
			this.latestValue = v;
			this.publish(this.latestValue, "change");
		}
	}

	peek(): T {
		return this.latestValue;
	}
}
