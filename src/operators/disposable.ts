export abstract class Disposable {
	public isDisposed: boolean;

	constructor() {
		this.isDisposed = false;
	}

	abstract dispose(): void;
}
