import { Subscribable } from "./subscribable";
import { Subscription } from "./subscription";
import { wake, sleep, touch } from "../dependency-detection";
import { Operator } from "./operator";

type EvaluatorFn<T = unknown> = () => T;

export class Computed<T = unknown> extends Operator<T> {
	public isPristine: boolean;
	public isDisposed: boolean;
	private deps: Map<Subscribable, Subscription>;
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

	update(): void {
		this.publish(this.value);
	}

	sync(subable: Subscribable) {
		if (!this.deps.has(subable)) {
			this.deps.set(
				subable,
				subable.subscribe(_ => {
					this.latestValue = this.evaluator();
					this.publish(this.latestValue);
				})
			);
		}
	}

	dispose() {
		if (!this.isDisposed) {
			this.deps.forEach(sub => sub.dispose());
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

function absorb(obj: object, deep: boolean = true): Subscribable[] {
	return Array.from(
		Object.values(obj).reduce((deps: Set<Subscribable>, value: any) => {
			if (value instanceof Operator) {
				deps.add(value);
			} else if (typeof value === "object" && value !== null && deep) {
				absorb(value).forEach(dep => deps.add(dep));
			}

			return deps;
		}, new Set<Subscribable>())
	);
}
