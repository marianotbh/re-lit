import { Disposable } from "./disposable";
import { addDisposeCallback } from "../dom-tracking";

export class Subscription<T = unknown> extends Disposable {
	private onUpdate: Function;
	private onDispose: Function;
	public isDisposed: boolean;

	constructor(onUpdate: Function, onDispose: Function = () => {}) {
		super();
		this.onUpdate = onUpdate;
		this.onDispose = onDispose;
		this.isDisposed = false;
	}

	update(newValue: T): void {
		this.onUpdate(newValue);
	}

	dispose(): void {
		if (!this.isDisposed && this.onDispose !== null) {
			this.onDispose();
			this.isDisposed = true;
		}
	}

	attach(node: Node): void {
		addDisposeCallback(node, () => {
			this.dispose();
		});
	}
}
