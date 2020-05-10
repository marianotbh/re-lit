import { Computed } from "../subscribables";

type EvaluatorFn<T = any> = () => T;

export const computed = <T = any>(evaluatorFn: EvaluatorFn<T>) => {
	return new Computed(evaluatorFn);
};
