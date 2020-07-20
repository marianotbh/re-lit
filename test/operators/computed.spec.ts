import { computed, observable, isComputed } from "../../src/operators";

test("isComputed", () => {
	expect(isComputed(1)).toBe(false);
	expect(isComputed("not computed")).toBe(false);
	expect(isComputed(true)).toBe(false);
	expect(isComputed(false)).toBe(false);
	expect(isComputed(null)).toBe(false);
	expect(isComputed(undefined)).toBe(false);
	expect(isComputed(NaN)).toBe(false);
	expect(isComputed(computed(() => {}))).toBe(true);
});

test("computed value should be the result of evaluator fn", () => {
	const someValue = "computed";
	const computedValue = computed(() => `testing ${someValue}`);

	expect(computedValue.value).toEqual("testing computed");
});

test("computed value should update according to its dependencies", () => {
	const someVal = observable(1);
	const someOtherVal = observable(1);
	const computedValue = computed(() => someVal.value + someOtherVal.value);

	someVal.value = 2;

	expect(computedValue.value).toEqual(3);
});
