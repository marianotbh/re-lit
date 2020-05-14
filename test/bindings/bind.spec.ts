import { bind, BindingContext, getContext, hasContext } from "../../src/bindings";

const createTestNode = () => {
	const node = document.createElement("div");
	node.innerHTML = `
            <div>a</div>
            <div>b</div>
            <div>c</div>
        `;
	return node;
};

const validateContext = (node: Node, context: BindingContext) =>
	hasContext(node) && getContext(node) === context;

/**
 * this function internally calls process and apply but we'll be testing those functions separately.
 * we'll only need to make sure it links a BindingContext to a node and its children
 */
describe("bind", () => {
	it("should apply an instance of BindingContext to a node", async () => {
		const node = createTestNode();
		const ctxt = new BindingContext({});

		await bind(node, ctxt);

		expect(validateContext(node, ctxt)).toBe(true);
		for (const child of node.childNodes) {
			expect(validateContext(child, ctxt)).toBe(true);
		}
	});

	it("should not applied the instance of BindingContext to the node's children if recursively is set to false", async () => {
		const node = createTestNode();
		const ctxt = new BindingContext({});

		await bind(node, ctxt, false);

		expect(validateContext(node, ctxt)).toBe(true);
		for (const child of node.childNodes) {
			expect(validateContext(child, ctxt)).toBe(false);
		}
	});

	it("should throw when trying to set context of an already bound node", async () => {
		const node = createTestNode();
		const ctxt = new BindingContext({});

		await bind(node, ctxt);

		expect(bind(node, ctxt)).rejects.toThrowError("cannot bind context to an already bound node");
	});
});
