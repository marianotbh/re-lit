import { Operator } from "../subscribables";

export function intercept<T extends Record<string | number, any> = object>(vm: T): T {
	return new Proxy(vm, {
		get(target, prop: string | number, _receiver) {
			const val = target[prop];
			if (val instanceof Operator) {
				return val.value;
			} else {
				return val;
			}
		}
	});
}
