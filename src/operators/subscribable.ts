import { Subscription } from "./subscription";

export abstract class Subscribable<T = unknown> {
	private subs: Set<Subscription>;

	constructor() {
		this.subs = new Set();
	}

	subscribe(callback: (update: T) => void): Subscription<T> {
		const sub = new Subscription<T>(callback);
		this.subs.add(sub);
		return sub;
	}

	once(callback: (update: T) => void): Subscription<T> {
		const sub = new Subscription<T>(val => {
			callback(val);
			sub.dispose();
		});
		this.subs.add(sub);
		return sub;
	}

	protected publish(value: T): void {
		this.subs.forEach(sub => {
			if (!sub.isDisposed) {
				sub.update(value);
			}
		});
	}
}
