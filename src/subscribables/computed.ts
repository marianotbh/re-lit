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
		this.latestValue = (null as unknown) as T;
	}

	get value(): T {
		if (this.isPristine) {
			this.isPristine = false;

			activate(this);

			const result = this.evaluator();

			if (typeof result === "object" && result !== null) {
				if (result instanceof Operator) {
					this.attach(result);
				} else {
					this.attach(...trackDeps(result as any));
				}
			}

			sleep();

			this.latestValue = result;
		} else {
			this.latestValue = this.evaluator();
		}

		return this.latestValue;
	}

	update(): void {
		this.publish(this.latestValue, "change");
	}

	attach(...deps: Subscribable[]) {
		deps.forEach(dep => {
			if (!this.isDisposed && !this.dependencies.has(dep)) {
				const subscription = dep.subscribe(() => {
					this.publish(this.value);
				});
				this.dependencies.set(dep, subscription);
			}
		});
	}

	dispose() {
		if (!this.isDisposed) {
			this.dependencies.forEach(subscription => subscription.dispose());
			this.dependencies.clear();
			this.isDisposed = true;
		}
	}
}

function trackDeps(obj: object, deep: boolean = true): Subscribable[] {
	return Array.from(
		Object.entries(obj)
			.reduce((deps, [_, value]) => {
				if (value instanceof Operator) {
					deps.add(value);
				} else if (typeof value === "object" && value !== null && deep) {
					trackDeps(value).forEach(dep => deps.add(dep));
				}

				return deps;
			}, new Set<Subscribable>())
			.values()
	);
}
