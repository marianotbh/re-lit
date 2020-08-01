import { Subscribable } from "./subscribable";
import { wake, sleep, touch } from "../dependency-detection";
import { Operator } from "./operator";

type EvaluatorFn<T = unknown> = () => T;

export class Computed<T = unknown> extends Operator<T> {
	public isPristine: boolean;
	public isDisposed: boolean;
	private deps: Map<Subscribable, (val: unknown) => void>;
	private evaluator: EvaluatorFn<T>;
	protected latestValue: T;

	constructor(evaluator: EvaluatorFn<T>) {
		super();
		this.isPristine = true;
		this.isDisposed = false;
		this.deps = new Map();
		this.evaluator = evaluator;
		this.latestValue = (null as unknown) as T;
	}

	get value(): T {
		if (this.isPristine) {
			this.isPristine = false;

			wake(this);
			this.latestValue = this.evaluator();
			sleep();
		} else {
			this.latestValue = this.evaluator();
		}

		touch(this);

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

	/**
	 * adds a dependency to the computed object
	 * outside the ones already detected by the evaluator function
	 * @param subable the dependency to be detected
	 */
	sync(dep: Subscribable) {
		if (!this.deps.has(dep)) {
			this.deps.set(
				dep,
				dep.subscribe(_ => {
					this.latestValue = this.evaluator();
					this.publish(this.latestValue);
				}, false)
			);
		}
	}

	/**
	 * it's important to dispose the computed operator once it's no longer needed
	 * so that it can cut ties with its dependencies and the evaluator function stops being called
	 * mostly used internally by the library, in most cases you won't need to manually dipose an computed operator
	 */
	dispose() {
		if (!this.isDisposed) {
			Array.from(this.deps.entries()).forEach(([dep, fn]) => dep.unsubscribe(fn));
			this.deps.clear();
			this.isDisposed = true;
		}
	}
}

export const computed = <T = unknown>(evaluatorFn: EvaluatorFn<T>) => {
	return new Computed(evaluatorFn);
};

export const isComputed = (value: any): value is Computed => {
	return value instanceof Computed;
};
