export class BindingContext<T extends object = object> {
	public vm: T;
	public parent: object | null;
	public parents: Array<object>;
	public parentContext: BindingContext | null;
	public root: object;
	public ref: HTMLElement;
	public slot: DocumentFragment | null;

	constructor(vm: T, parentContext: BindingContext | null = null) {
		this.vm = vm;

		if (parentContext !== null) {
			this.parentContext = parentContext;
			this.parent = parentContext.vm;
			this.parents = [...parentContext.parents, parentContext.vm];
			this.root = parentContext.root;
		} else {
			this.parentContext = null;
			this.parent = null;
			this.parents = [];
			this.root = vm;
		}
	}

	static from<K extends object = object>(data: K) {
		return new BindingContext<K>(data);
	}

	createChild<K extends object = object>(vm: K): BindingContext<K> {
		return new BindingContext<K>(vm, this);
	}
}
