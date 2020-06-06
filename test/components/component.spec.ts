import { registerComponent, isComponent } from "../../src/components";

test("isComponent", () => {
	const node = document.createElement("some-undefined-component");
	expect(isComponent(node.tagName.toLowerCase())).toBe(false);
	registerComponent("some-undefined-component", { template: "abc" });
	expect(isComponent(node.tagName.toLowerCase())).toBe(true);
});

describe("registerComponent", () => {});
test("same component name can only be defined once", () => {
	const testDefine = () => {
		registerComponent("test-duplicate-definition", {
			template: "<h1>hello</h1>"
		});
	};

	// call registerComponent once
	testDefine();

	// calling again with same component name should throw
	expect(testDefine).toThrowError(`component "test-duplicate-definition" is already registered`);
});

test("should not be able to define empty template component", () => {
	const testDefine = () => {
		registerComponent("test-no-template", {
			template: ""
		});
	};

	// calling again with same component name should throw
	expect(testDefine).toThrowError(`component "test-no-template" has no template`);
});
