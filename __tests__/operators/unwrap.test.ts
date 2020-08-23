import { unwrap, observe, compose } from "../../src";

describe("unwrap", () => {
	it("should return either the passed primitive or the internal value of the operator", () => {
		expect(unwrap(1)).toEqual(1);
		expect(unwrap("abc")).toEqual("abc");
		expect(unwrap([1, 2, 3])).toEqual([1, 2, 3]);
		expect(unwrap({ a: 1 })).toEqual({ a: 1 });
		expect(unwrap(observe(1))).toEqual(1);
		expect(unwrap(compose(() => `computed`))).toEqual("computed");
	});

	it("should correctly unwrap functions according to whether they receive parameters or not", () => {
		const functionWithNoParameters = () => "test";
		const functionWithParameters = (a: number, b: number) => a + b;

		expect(unwrap(functionWithNoParameters)).toBe("test");
		expect(unwrap(functionWithParameters)).toBe(functionWithParameters);
	});
});
