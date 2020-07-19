import $, { mount, observable } from "../../src";

describe("mount", () => {
	it("should create the give Template on the passed dom node", async () => {
		const root = document.createElement("div");

		const template = $`<div>hello, world</div>`;

		await mount(root, template);

		expect(root.firstElementChild).not.toBeNull();
		expect(root.firstElementChild!.innerHTML).toMatch(/hello, world/g);
	});
});
