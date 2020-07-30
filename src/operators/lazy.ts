import { Template } from "../core/pesos";

type DefaultExport<T> = { default: (args: T) => Template };

export function lazy<T extends {} = {}>(loader: () => Promise<DefaultExport<T>>) {
	return async (args?: T) => {
		const { default: template } = await loader();
		return template(args ?? ({} as T));
	};
}
