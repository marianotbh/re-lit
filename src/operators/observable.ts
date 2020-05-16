import { Observable } from "../subscribables";

export const observable = <T = unknown>(initialValue: T) => {
	return new Observable(initialValue);
};
