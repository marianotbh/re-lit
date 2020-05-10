import { mount, getContext } from "../../src/bindings";
import { getNodeData } from "../../src/dom-tracking";

describe("mount", () => {
	it("should bind a data context to a tree and set a dispose callback to dispose the MutationObserver when the rootNode is removed from the DOM", async () => {
		// arange
		const root = document.createElement("main");
		const context = { hello: "world" };

		// act
		await mount(root, context);

		// assert
		const domData = getNodeData(root);
		const rootContext = getContext(root);

		expect(domData).not.toBeNull();
		expect(rootContext).not.toBeNull();
		expect(rootContext.vm).toBe(context);
	});
});
