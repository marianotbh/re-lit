import { BindingContext } from "../../src/bindings";

describe("evaluate", () => {
	const dummyContext = BindingContext.from({
		hello: "world"
	});

	it("should convert a expression string to its actual value given a context", () => {});
});
