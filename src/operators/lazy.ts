type DefaultExport<T extends any[]> = { default: (...args: T) => DocumentFragment };

export function lazy<T extends any[]>(loader: () => Promise<DefaultExport<T>>) {
	return async (...args: T) => {
		const { default: template } = await loader();
		return template(...args);
	};
}
