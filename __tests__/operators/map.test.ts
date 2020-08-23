import { isObservable, map } from "../../src";

describe("map operator", () => {
	it("should wrap all of the primitive properties in observables and discard function properties", () => {
		const simpleObject = {
			numberProperty: 1,
			stringProperty: "foo",
			functionProperty: () => {}
		};

		const mappedObject = map(simpleObject);

		expect(isObservable(mappedObject.numberProperty)).toBeTruthy();
		expect(mappedObject.numberProperty.value).toBe(1);
		expect(isObservable(mappedObject.stringProperty)).toBeTruthy();
		expect(mappedObject.stringProperty.value).toBe("foo");
		expect("functionProperty" in mappedObject).toBeFalsy();
	});
});
