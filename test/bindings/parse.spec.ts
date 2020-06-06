import { parse } from "../../src/bindings/parse";
import { BindingContext } from "../../src/bindings";

describe("parse", () => {
	it("should create a to apply a handler given its name, an expression and a binding context", async () => {
		const context = BindingContext.from({});

		const apply = parse("some-unregistered-handler", "1 + 1", context);

		expect(apply).toBeNull();
	});

	it("should create a to apply a handler given its name, an expression and a binding context", async () => {
		const node = document.createElement("div");
		const context = BindingContext.from({});

		const apply = parse("if", "true", context);

		await expect(apply(node)).resolves.not.toThrow();
	});
});
