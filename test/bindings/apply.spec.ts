import { apply, handle, BindingContext, bind } from "../../src/bindings";
import { handlersFor } from "../../src/bindings/apply";

describe("handlersFor", () => {
	it("should return an array of the applied handlers to a node", async () => {
		// arrange
		const node = document.createElement("main");
		node.setAttribute(":text", "''");
		node.setAttribute(":if", "false");
		node.setAttribute(":ref", "() => {}");
		const context = BindingContext.from({});

		// act
		await bind(node, context);

		// assert
		const handlers = handlersFor(node);
		expect(handlers.length).toBe(3);
		expect(handlers).toEqual(["text", "if", "ref"]);
	});
});

describe("apply", () => {
	it("should apply handler to node", async () => {
		// arrange
		const node = document.createElement("main");
		handle("test-handler-apply", {});
		const accessor = (): null => null;
		const context = BindingContext.from({});

		// act
		await apply("test-handler-apply", node, accessor, context);

		// assert
		expect(handlersFor(node)[0]).toBe("test-handler-apply");
	});
});
