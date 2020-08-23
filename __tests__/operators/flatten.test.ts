import { compose, flatten, isObservable, observe } from "../../src";

describe("flatten operator", () => {
	it("given an object with complex properties, flatten should unwrap all of their values and return a flat object", () => {
		const complexObject = {
			observableProp: observe("bar"),
			composedProp: compose(() => "composed value"),
			noParameterFunctionProp: () => "return value",
			functionWithParametersProp: (a: number, b: number) => a + b,
			primitiveNumberProp: 1,
			primitiveStringProp: "im a string"
		};

		const flatObject = flatten(complexObject);

		expect(flatObject.observableProp).toBe("bar");
		expect(flatObject.composedProp).toBe("composed value");
		expect(flatObject.noParameterFunctionProp).toBe("return value");
		expect(flatObject.functionWithParametersProp).toBe(complexObject.functionWithParametersProp);
		expect(flatObject.primitiveNumberProp).toBe(1);
		expect(flatObject.primitiveStringProp).toBe("im a string");
	});
});
