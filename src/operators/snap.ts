import { Operator } from "./operator";
import { unwrap } from "./unwrap";

export type Snap<TTarget extends object> = {
	[key in keyof TTarget]: TTarget[key] extends Operator ? TTarget[key]["value"] : TTarget[key];
};

export function snap<TTarget extends object>(target: TTarget): Snap<TTarget> {
	return <Snap<TTarget>>Object.fromEntries(
		Object.entries(target).map(([key, value]) => {
			return [key, unwrap(value)] as const;
		})
	);
}
