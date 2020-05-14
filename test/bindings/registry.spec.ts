import * as registry from "../../src/bindings/registry";
import { BindingContext } from "../../src/bindings";

test("hasContext", () => {
	const node = document.createElement("div");

	const result = registry.hasContext(node);

	expect(result).toBe(false);
});

test("getContext", () => {
	const node = document.createElement("div");

	const result = registry.getContext(node);

	expect(result).toBe(null);
});

test("setContext", () => {
	// arrange
	const node = document.createElement("div");
	const context = new BindingContext({});

	// act
	registry.setContext(node, context);

	// assert
	expect(registry.hasContext(node)).toBe(true);
	expect(registry.getContext(node)).toBe(context);
});
