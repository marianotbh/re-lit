import { html } from "../../src";
import { onRemove, trackDOM } from "../../src/dom";

describe("dom tracker", () => {
	it("should should instanciate a Mutation Observer that triggers onRemove callbacks when nodes are removed from the DOM", done => {
		const root = document.createElement("main");
		root.append(html`<div><p>hello, world</p></div>`);

		trackDOM(root);

		const p = root.querySelector("p")!;

		onRemove(p, node => {
			expect(node.textContent).toBe("hello, world");
			done();
		});

		root.firstElementChild?.removeChild(p);
	});
});
