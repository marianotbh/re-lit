import { compose, observe } from "../../src";
import { isOperator } from "../../src/operators/operator";

test("isOperator", () => {
	expect(isOperator(observe(1))).toBeTruthy();
	expect(isOperator(compose(() => 1))).toBeTruthy();
	expect(isOperator(1)).toBeFalsy();
	expect(isOperator("abc")).toBeFalsy();
	expect(isOperator([1, 2, 3])).toBeFalsy();
	expect(isOperator({ a: 1 })).toBeFalsy();
});
