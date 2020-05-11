import { createViewModel, CleanViewModel, ClassViewModel, ViewModelFactory } from "./vm";
import { createTemplate } from "./template";

export type ComponentFactory = {
	viewModel: ViewModelFactory;
	template: DocumentFragment;
};

export type ComponentDefinition<TParams extends object = object> = {
	template: string;
	viewModel?: CleanViewModel<TParams> | ClassViewModel<TParams>;
};

export type Def<TParams extends object = object> = ComponentDefinition<TParams>;

const definitions = new Map<string, ComponentDefinition>();
const factories = new Map<string, ComponentFactory>();

export function defineComponent<TParams extends object = object>(
	name: string,
	{ template, viewModel }: ComponentDefinition<TParams>
): void {
	if (definitions.has(name)) {
		throw new Error(`Component ${name} is already registered`);
	} else if (template.trim().length === 0) {
		throw new Error(`Component ${name} has no template`);
	} else {
		// todo: refactor typings, cannot get it right atm
		definitions.set(name, {
			template,
			viewModel: viewModel as any
		});
	}
}

export function isComponent(name: string): boolean {
	return definitions.has(name);
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

	let vmFactory: ViewModelFactory;

	if (typeof viewModel === "undefined") {
		vmFactory = params => params;
	} else {
		vmFactory = createViewModel(viewModel);
	}

	const factory = {
		template: createTemplate(template),
		viewModel: vmFactory
	};

	factories.set(name, factory);

	return factory;
}
