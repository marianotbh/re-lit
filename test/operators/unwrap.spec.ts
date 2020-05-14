import { unwrap, observable, computed } from "../../src/operators";

describe("unwrap", () => {
	it("should return the inner value of an observable", () => {
		const observableValue = observable(1);

		const result = unwrap(observableValue);

		expect(result).toEqual(1);
	});

	it("should return the inner value of a computed", () => {
		const computedValue = computed(() => `computed`);

		const result = unwrap(computedValue);

		expect(result).toEqual("computed");
	});

	it("should return the value of a primitive variable", () => {
		const numberValue = 1;
		const stringValue = "abc";
		const objectValue = { a: 1 };
		const arrayValue = [1, 2, 3];

		expect(unwrap(numberValue)).toEqual(1);
		expect(unwrap(stringValue)).toEqual("abc");
		expect(unwrap(arrayValue)).toEqual([1, 2, 3]);
		expect(unwrap(objectValue)).toEqual({ a: 1 });
	});
});
