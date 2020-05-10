import { Subscribable } from "./subscribable";
import { Subscription } from "./subscription";
import { activate, sleep } from "../dependency-detection";
import { Operator } from "./operator";

type EvaluatorFn<T = unknown> = () => T;

export class Computed<T = unknown> extends Operator<T> {
	public isPristine: boolean;
	public isDisposed: boolean;
	private dependencies: Map<Subscribable, Subscription>;
	private evaluator: EvaluatorFn<T>;
	protected latestValue: T;

	constructor(evaluator: EvaluatorFn<T>) {
		super();
		this.isPristine = true;
		this.isDisposed = false;
		this.dependencies = new Map();
		this.evaluator = evaluator;
		activate(this);
		this.latestValue = evaluator();
		sleep();
	}

	get value(): T {
		this.latestValue = this.evaluator();

		return this.latestValue;
	}

	update(): void {
		this.publish(this.latestValue, "change");
	}

	attach(dependency: Subscribable) {
		if (!this.isDisposed && !this.dependencies.has(dependency)) {
			const subscription = dependency.subscribe(() => {
				this.publish(this.value);
			});
			this.dependencies.set(dependency, subscription);
		}
	}

	dispose() {
		if (!this.isDisposed) {
			this.dependencies.forEach(subscription => subscription.dispose());
			this.dependencies.clear();
			this.isDisposed = true;
		}
	}
}
