import { unwrap, observable, computed } from "../../src/operators";

describe("unwrap", () => {
	it("should return either the passed primitive or the internal value of the operator", () => {
		expect(unwrap(1)).toEqual(1);
		expect(unwrap("abc")).toEqual("abc");
		expect(unwrap([1, 2, 3])).toEqual([1, 2, 3]);
		expect(unwrap({ a: 1 })).toEqual({ a: 1 });
		expect(unwrap(observable(1))).toEqual(1);
		expect(unwrap(computed(() => `computed`))).toEqual("computed");
	});
});
