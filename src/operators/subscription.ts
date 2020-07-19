import { Disposable } from "./disposable";
import { addDisposeCallback } from "../dom-tracking";

export class Subscription<T = unknown> extends Disposable {
	private callback: Function;
	public isDisposed: boolean;

	constructor(callback: (val: T) => void) {
		super();
		this.callback = callback;
		this.isDisposed = false;
	}

	update(newValue: T): void {
		this.callback(newValue);
	}

	dispose(): void {
		if (!this.isDisposed) {
			this.isDisposed = true;
		}
	}

	attach(node: Node): void {
		addDisposeCallback(node, () => {
			this.dispose();
		});
	}
}
