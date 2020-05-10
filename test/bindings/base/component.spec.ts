import { BindingContext, bind, getContext, apply } from "../../../src/bindings";
import { defineComponent } from "../../../src/components";

// generate a class ViewModel for testing purposes (easier to test with instance of)
class TestViewModel {}

// declaration is separate for easier comparison inside the test
const template = "<h1>hello world</h1>";
const template2 = "<h1>hello world</h1>";

defineComponent("test-component", { viewModel: TestViewModel, template });
defineComponent("test-component-two", { viewModel: TestViewModel, template: template2 });

describe("component handler", () => {
	it("should correctly inject the components template", async () => {
		// arrange
		const context = BindingContext.from({});
		const container = document.createElement("div");

		// act
		container.innerHTML = `<test-component></test-component>`;
		await bind(container, context);
		const testComponent = container.querySelector("test-component");

		// assert
		expect(testComponent.innerHTML.trim()).toBe(template);
	});

	it("should generate a child context with an instance of the viewModel", async () => {
		// arramge
		const context = BindingContext.from({});
		const container = document.createElement("div");

		// act
		container.innerHTML = `<test-component></test-component>`;
		await bind(container, context);
		const testComponent = container.querySelector("test-component");

		// assert
		const componentContext = getContext(testComponent.firstElementChild);
		expect(componentContext.vm).toBeInstanceOf(TestViewModel);
	});

	it("should act the same with regular binding syntax", async () => {
		// arrange
		const context = BindingContext.from({});
		const container = document.createElement("div");

		// act
		container.innerHTML = `<div :component="{ name: 'test-component' }"></div>`;
		await bind(container, context);
		const testComponent = container.querySelector("div");

		// assert
		expect(testComponent.innerHTML.trim()).toBe(template);
	});

	it("should only be able to be applied on HTMLElement", async () => {
		// arramge
		const htmlElement = document.createElement("div");
		const textNode = document.createTextNode("some text node");
		const commentNode = document.createComment("some comment node");

		// act
		const applyFn = async (node: Node) =>
			await apply("component", node, () => ({
				name: "test-component"
			}));

		// assert
		expect(applyFn(htmlElement)).resolves.toEqual(true);
		expect(applyFn(textNode)).rejects.toThrowError(
			"component handler can only be applied on HTMLElement"
		);
		expect(applyFn(commentNode)).rejects.toThrowError(
			"component handler can only be applied on HTMLElement"
		);
	});
});
