import { Observable } from "../subscribables";

export const observable = <T = any>(initialValue: T) => {
	return new Observable(initialValue);
};
