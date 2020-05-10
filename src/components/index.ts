import { createViewModel, CleanViewModel, ClassViewModel, ViewModelFactory } from "./vm";
import { createTemplate } from "./template";

export type ComponentFactory = {
	viewModel: ViewModelFactory;
	template: DocumentFragment;
};

export type ComponentDefinition<TParams extends object = object> = {
	template: string;
	viewModel: CleanViewModel<TParams> | ClassViewModel<TParams>;
};

export type Def<TParams extends object = object> = ComponentDefinition<TParams>;

const definitions = new Map<string, ComponentDefinition>();
const factories = new Map<string, ComponentFactory>();

export function defineComponent(name: string, definition: ComponentDefinition): void {
	if (definitions.has(name)) throw new Error(`Component ${name} is already registered`);
	if (definition.template.trim().length === 0) throw new Error(`Component ${name} has no template`);
	definitions.set(name, definition);
}

export function isComponent(node: string | HTMLElement): boolean {
	const tagName = typeof node === "string" ? node : node.tagName.toLowerCase();
	return definitions.has(tagName);
}

export function createComponent(name: string): ComponentFactory | null {
	const component = definitions.get(name);

	if (typeof component === "undefined") {
		return null;
	}

	if (factories.has(name)) {
		return factories.get(name);
	}

	const { template, viewModel } = component;

	const factory = {
		template: createTemplate(template),
		viewModel: createViewModel(viewModel)
	};

	factories.set(name, factory);

	return factory;
}
