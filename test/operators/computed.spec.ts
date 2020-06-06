import { computed, observable } from "../../src/operators";

test("computed should return instance of Computed", () => {
	const subscribable = computed(() => true);

	expect(typeof subscribable.value).toBe("boolean");
});

test("computed value should be the result of evaluator fn", () => {
	const someValue = "asdf";
	const evaluator = () => `testing ${someValue}`;
	const result = evaluator();
	const computedValue = computed(evaluator);

	expect(computedValue.value).toEqual(result);
});

test("computed value should update according to its dependencies", () => {
	const someVal = observable(1);
	const someOtherVal = observable(1);
	const evaluator = () => someVal.value + someOtherVal.value;
	const computedValue = computed(evaluator);

	someVal.value = 2;

	expect(computedValue.value).toEqual(3);
});
