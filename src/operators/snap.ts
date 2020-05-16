import { Operator } from "../subscribables";
import { unwrap } from "./unwrap";

export type SnapShot<TTarget extends object = object> = {
	[key in keyof TTarget]: TTarget[key] extends Operator ? TTarget[key]["value"] : TTarget[key];
};

export function snap<TTarget extends object = object>(target: TTarget): SnapShot<TTarget> {
	return <SnapShot<TTarget>>Object.fromEntries(
		Object.entries(target).map(([key, value]) => {
			return [key, unwrap(value)];
		})
	);
}
