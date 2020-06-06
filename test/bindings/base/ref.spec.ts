import { apply, BindingContext } from "../../../src/bindings";

describe("ref handler", () => {
	it("should invoke de provided callback passing the element it was bound to and the binding context", async () => {
		const node = document.createElement("div");
		const context = BindingContext.from({});

		const callback = (el: Node, ctxt: BindingContext) => {
			expect(el).toBe(node);
			expect(ctxt).toBe(context);
		};

		await expect(apply("ref", node, () => callback, context)).resolves.not.toThrow();
	});

	it("should invoke de provided callback passing the element it was bound to and the binding context", async () => {
		const node = document.createElement("div");
		const context = BindingContext.from({});

		await expect(apply("ref", node, () => "abc", context)).rejects.toThrowError(
			"ref value must be a valid callback function"
		);
	});
});
