import { compose, observe, isComposed } from "../../src";

test("isComposed", () => {
	expect(isComposed(1)).toBe(false);
	expect(isComposed("not compose")).toBe(false);
	expect(isComposed(true)).toBe(false);
	expect(isComposed(false)).toBe(false);
	expect(isComposed(NaN)).toBe(false);
	expect(isComposed(compose(() => {}))).toBe(true);
});

test("compose value should be the result of evaluator fn", () => {
	const someValue = "compose";
	const composeValue = compose(() => `testing ${someValue}`);

	expect(composeValue.value).toEqual("testing compose");
});

test("compose value should update according to its dependencies", () => {
	const someVal = observe(1);
	const someOtherVal = observe(1);
	const composeValue = compose(() => someVal.value + someOtherVal.value);

	expect(composeValue.value).toEqual(2);

	someVal.value = 2;

	expect(composeValue.value).toEqual(3);
});
