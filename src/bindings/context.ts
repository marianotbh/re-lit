export class BindingContext<T extends object = object> {
	public vm: T;
	public parent: object | null;
	public parents: Array<object>;
	public parentContext: BindingContext | null;
	public root: object;
	public ref: HTMLElement;
	public slot: DocumentFragment | null;

	constructor(vm: T, ref: HTMLElement, parentContext: BindingContext | null = null) {
		this.vm = vm;
		this.ref = ref;
		this.slot = null;

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

	static from<K extends object = object>(data: K, ref: HTMLElement) {
		return new BindingContext<K>(data, ref);
	}

	createChild<K extends object = object>(vm: K, ref: HTMLElement): BindingContext<K> {
		return new BindingContext<K>(vm, ref, this);
	}

	set(name: string, value: any) {
		Object.defineProperty(this, name, { value, enumerable: true });
	}

	get(name: string) {
		return Object.getOwnPropertyDescriptor(this, name)?.value;
	}

	extend(values: object) {
		return { ...this, ...values };
	}
}
