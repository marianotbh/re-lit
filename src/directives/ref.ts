import { Observable } from "../operators/observable";

export function ref(observable: Observable) {
	return function (el: Element) {
		observable.value = el;
	};
}
