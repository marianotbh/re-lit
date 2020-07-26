import { Observable } from "../operators/observable";

export function ref<T extends Node = Node>(observable: Observable<T | null>) {
	return function (el: T) {
		observable.value = el;
	};
}
