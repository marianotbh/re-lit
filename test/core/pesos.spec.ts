import $, { observable } from "../../src";

describe("pesos", () => {
	it("should create the give Template on the passed dom node", () => {
		const whom = observable("world");
		const el = $`<div>hello, ${whom}</div>`.render();

		expect(el).not.toBeNull();
		expect(el.textContent).toMatch(/hello, world/g);
	});

	it("should create the give Template on the passed dom node", () => {
		const whom = observable("world");
		const el = $`<div>hello, ${whom}</div>`.render();

		whom.value = "weni";

		expect(el.textContent).toMatch(/hello, weni/g);
	});

	it("should create the give Template on the passed dom node", () => {
		const whom = observable("world");
		const childEl = $`<div>hello, ${whom}</div>`;
		const el = $`<div>${childEl}</div>`.render();

		expect(el.textContent).toMatch(/hello, world/g);
	});

	it("should correctly display conditional renderings", () => {
		const conditional = observable(true);
		const el = $`<div>${() => (conditional.value ? $`true!!` : $`false!!`)}</div>`.render();

		expect(el.textContent).toMatch(/true!!/g);

		conditional.value = false;

		expect(el.textContent).toMatch(/false!!/g);
	});
});
