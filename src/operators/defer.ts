import { observe } from "./observe";

type PromiseOfTemplate = Promise<DocumentFragment>;

export function defer(promiseOfTemplate: PromiseOfTemplate, fallback: DocumentFragment | null = null) {
	const observableTemplate = observe<DocumentFragment | null>(fallback);

	promiseOfTemplate.then(template => {
		observableTemplate.value = template;
	});

	return () => observableTemplate.value;
}
