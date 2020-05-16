import { Observable } from "../subscribables";
import { observable } from "./observable";

export type ObservableObject<TObject extends object = object> = {
	[key in keyof TObject]: TObject[key] extends Function
		? TObject[key]
		: TObject[key] extends object
		? ObservableObject<TObject[key]>
		: Observable<TObject[key]>;
};

export function map<TObject extends object = object>(target: TObject): ObservableObject<TObject> {
	return <ObservableObject<TObject>>Object.fromEntries(
		Object.entries(target).map(([key, value]) => {
			if (typeof value === "function") {
				return [key, value];
			} else if (typeof value === "object") {
				return [key, map(value)];
			} else {
				return [key, observable(value)];
			}
		})
	);
}
