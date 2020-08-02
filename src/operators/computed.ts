import { Subscribable } from "./subscribable";
import { wake, sleep, touch, dispose, collect } from "../dependency-detection";
import { Operator } from "./operator";

type EvaluatorFn<T = unknown> = () => T;

export class Computed<T = unknown> extends Operator<T> {
	public isPristine: boolean;
	public isDisposed: boolean;
	private evaluator: EvaluatorFn<T>;

	constructor(evaluator: EvaluatorFn<T>) {
		super();
		this.isPristine = true;
		this.isDisposed = false;
		this.evaluator = evaluator;
	}

	get value(): T {
		let newValue: T | undefined;

		if (this.isPristine) {
			this.isPristine = false;

			wake(this);
			newValue = this.evaluator();
			sleep();

			collect(this).forEach(dep => {
				dep.subscribe(_ => this.force());
			});
		} else {
			newValue = this.evaluator();
		}

		if (newValue !== this.latestValue) {
			this.latestValue = newValue;
			touch(this);
		}

		return this.latestValue;
	}

	/**
	 * forces an evaluation of the computed function.
	 * most times u won't be needing this function, it's mostly used internally by the library
	 * force the first update of passed function arguments in template literals
	 */
	force(): void {
		this.publish(this.value);
	}
}

/**
 *
 * @param evaluatorFn
 */
export const computed = <T = unknown>(evaluatorFn: EvaluatorFn<T>) => {
	return new Computed(evaluatorFn);
};

export const isComputed = (value: any): value is Computed => {
	return value instanceof Computed;
};
