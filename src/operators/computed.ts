import { Computed } from "../subscribables";

type EvaluatorFn<T = unknown> = () => T;

export const computed = <T = unknown>(evaluatorFn: EvaluatorFn<T>) => {
	return new Computed(evaluatorFn);
};
