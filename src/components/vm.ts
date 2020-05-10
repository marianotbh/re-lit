import { Params } from "./params";

export abstract class ViewModel {
	onInit(): void {}
	onDispose(): void {}
}

export type CleanViewModel<TParams = {}> = (params: Params<TParams>) => object;

export type ClassViewModel<TParams = {}> = { new (params: Params<TParams>): object };

type SimpleVM = { dispose?(): void };

export type ViewModelFactory = (params: Params<any>) => ViewModel | SimpleVM;

export function createViewModel(vm: any): ViewModelFactory {
	if (typeof vm === "function") {
		if (isInstanciable(vm)) {
			return (params: Params<any>) => {
				const instance = new vm(params);

				if (instance instanceof ViewModel) {
					instance.onInit();
				}

				return instance;
			};
		} else {
			return (params: Params<any>) => {
				return vm(params);
			};
		}
	} else {
		throw new Error("Invalid ViewModel constructor");
	}
}

type Type<T = any, P = any> = { new (args: P): T };

function isInstanciable(vm: any): vm is Type {
	return "prototype" in vm;
}
