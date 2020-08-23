import { html, render } from "../../src";

describe("mount", () => {
	it("should create the give Template on the passed dom node", async () => {
		const root = document.createElement("div");
		const el = html`<div>hello, world</div>`;

		render(el, root);

		expect(root.firstElementChild).not.toBeNull();
		expect(root.firstElementChild!.innerHTML).toMatch(/hello, world/g);
	});
});
