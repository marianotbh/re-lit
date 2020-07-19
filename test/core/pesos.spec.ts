import $, { observable } from "../../src";

describe("pesos", () => {
	it("should create the give Template on the passed dom node", async () => {
		const whom = observable("world");
		const el = $`<div>hello, ${whom}</div>`.render();

		expect(el).not.toBeNull();
		expect(el.textContent).toMatch(/hello, world/g);
	});

	it("should create the give Template on the passed dom node", async done => {
		const whom = observable("world");
		const el = $`<div>hello, ${whom}</div>`.render();

		whom.value = "weni";

		setTimeout(() => {
			expect(el.textContent).toMatch(/hello, weni/g);
			done();
		}, 200);
	});
});
