import { addDependency } from "../core/pesos";

export abstract class Subscribable<T = unknown> {
	private subs: Set<(val: T) => void>;

	constructor() {
		this.subs = new Set();
	}

	subscribe(callback: (val: T) => void, add: boolean = true) {
		if (add) {
			addDependency(() => {
				this.subs.delete(callback);
			});
		}
		this.subs.add(callback);
		return callback;
	}

	once(callback: (val: T) => void, add: boolean = true) {
		const sub = (val: T) => {
			callback(val);
			this.subs.delete(sub);
		};

		if (add) {
			addDependency(() => {
				this.subs.delete(sub);
			});
		}

		this.subs.add(sub);

		return sub;
	}

	unsubscribe(callback: (val: T) => void) {
		this.subs.delete(callback);
	}

	protected publish(value: T): void {
		this.subs.forEach(sub => {
			sub(value);
		});
	}
}
