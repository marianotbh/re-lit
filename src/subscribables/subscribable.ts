import { Subscription } from "./subscription";

type SubscriptionCallback<T = unknown> = (newValue: T) => void;

export abstract class Subscribable<T = unknown> {
	private subscriptions: Map<string, Set<Subscription>>;

	constructor() {
		this.subscriptions = new Map();
	}

	subscribe(callback: SubscriptionCallback<T>, event: string = "change"): Subscription<T> {
		const subscription = new Subscription<T>(callback, () => {
			this.subscriptions.get(event)?.delete(subscription);
		});

		if (this.subscriptions.has(event)) {
			const subscriptions = this.subscriptions.get(event);
			subscriptions?.add(subscription);
		} else {
			const subscriptions = new Set<Subscription>();
			subscriptions.add(subscription);
			this.subscriptions.set(event, subscriptions);
		}

		return subscription;
	}

	protected publish(value: T, event: string = "change"): void {
		if (this.subscriptions.has(event)) {
			const subscriptions = this.subscriptions.get(event);
			if (typeof subscriptions !== "undefined") {
				subscriptions.forEach(subscription => {
					if (!subscription.isDisposed) {
						subscription.update(value);
					}
				});
			}
		}
	}
}
