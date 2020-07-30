import { of } from "../operators";
import { Template } from "../core/pesos";

export function fallback(placeholder: Template) {
	return (promise: Promise<Template>) => {
		const template = of<Template>(placeholder);
		promise.then(t => (template.value = t));
		return () => template.value;
	};
}
