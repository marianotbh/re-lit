import { Disposable } from "./disposable";
import { addDisposeCallback } from "../dom-tracking";

export class Subscription<T = unknown> extends Disposable {
	private onUpdate: Function;
	private onDispose: Function | undefined;
	public isDisposed: boolean;

	constructor(onUpdate: (val: T) => void, onDispose?: () => void) {
		super();
		this.onUpdate = onUpdate;
		this.onDispose = onDispose;
		this.isDisposed = false;
	}

	update(newValue: T): void {
		this.onUpdate(newValue);
	}

	dispose(): void {
		if (!this.isDisposed && typeof this.onDispose === "function") {
			this.isDisposed = true;
			this.onDispose();
		}
	}

	attach(node: Node): void {
		addDisposeCallback(node, () => {
			this.dispose();
		});
	}
}
