export abstract class Subscribable<T = unknown> {
	private subs: Set<(val: T) => void>;

	constructor() {
		this.subs = new Set();
	}

	subscribe(callback: (val: T) => void) {
		this.subs.add(callback);
		return callback;
	}

	once(callback: (val: T) => void) {
		const sub = (val: T) => {
			callback(val);
			this.subs.delete(sub);
		};

		this.subs.add(sub);

		return sub;
	}

	unsubscribe(callback: (val: T) => void) {
		this.subs.delete(callback);
	}

	dispose() {
		this.subs.clear();
	}

	protected publish(value: T): void {
		this.subs.forEach(sub => {
			sub(value);
		});
	}
}
