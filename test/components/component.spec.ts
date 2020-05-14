import { defineComponent, isComponent } from "../../src/components";

test("isComponent", () => {
	const node = document.createElement("some-undefined-component");

	expect(isComponent(node.tagName.toLowerCase())).toBe(false);
});

describe("defineComponent", () => {});
test("same component name can only be defined once", () => {
	const testDefine = () => {
		defineComponent("test-duplicate-definition", {
			template: "<h1>hello</h1>",
			viewModel: () => ({})
		});
	};

	// call defineComponent once
	testDefine();

	// calling again with same component name should throw
	expect(testDefine).toThrowError("Component test-duplicate-definition is already registered");
});

test("should not be able to define empty template component", () => {
	const testDefine = () => {
		defineComponent("test-no-template", {
			template: "",
			viewModel: () => ({})
		});
	};

	// calling again with same component name should throw
	expect(testDefine).toThrowError("Component test-no-template has no template");
});
