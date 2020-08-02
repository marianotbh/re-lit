import html, { observable, computed, ref } from "../../src";

describe("pesos", () => {
	it("should create the give Template on the passed dom node", done => {
		const whom = observable("world");

		const template = html`<div>hello, ${whom}</div>`.render();

		setTimeout(() => {
			expect(template).not.toBeNull();
			expect(template.textContent).toMatch(/hello, world/g);
			done();
		});
	});

	it("should create the give Template on the passed dom node", done => {
		const whom = observable("world");
		const template = html`<div>hello, ${whom}</div>`.render();

		whom.value = "weni";

		setTimeout(() => {
			expect(template.textContent).toMatch(/hello, weni/g);
			done();
		});
	});

	it("should create be able to receive Template on the passed dom node", done => {
		const childTemplate = html`<div>hello, world</div>`;
		const parentTemplate = html`<div>${childTemplate}</div>`.render();

		setTimeout(() => {
			expect(parentTemplate.textContent).toMatch(/hello, world/g);
			done();
		});
	});

	it("should correctly display and update conditional renderings", done => {
		const conditional = observable(true);

		const template = html`
			<div>
				${() => (conditional.value ? html`<p>true!!</p>` : html`<p>false!!</p>`)}
			</div>
		`.render();

		setTimeout(() => {
			expect(template.textContent).toMatch(/true!!/g);
			conditional.value = false;
			expect(template.textContent).toMatch(/false!!/g);
			done();
		});
	});

	it("should assign attributes if the ", done => {
		const template = html`<div ${{ id: "test", class: "testable" }}></div>`.render();

		setTimeout(() => {
			expect(template.firstElementChild!.getAttribute("id")).toEqual("test");
			expect(template.firstElementChild!.getAttribute("class")).toEqual("testable");
			done();
		});
	});

	it("should correctly update computed attributes", done => {
		const id = observable("test");

		const template = html`<div ${{ id, class: () => id.value + "able" }}></div>`.render();

		setTimeout(() => {
			expect(template.firstElementChild!.getAttribute("id")).toEqual("test");
			expect(template.firstElementChild!.getAttribute("class")).toEqual("testable");
			id.value = "changed";
			expect(template.firstElementChild!.getAttribute("id")).toEqual("changed");
			expect(template.firstElementChild!.getAttribute("class")).toEqual("changedable");
			done();
		});
	});

	it("should correctly render attributes", done => {
		const options = observable([
			{ text: "one", value: 1 },
			{ text: "two", value: 2 },
			{ text: "three", value: 3 }
		]);

		const template = html`
			<select>
				<option>pick one</option>
				${() => options.value.map(({ value, text }) => html`<option ${{ value }}>${text}</option>`)}
			</select>
		`.render();

		setTimeout(() => {
			expect(template.firstElementChild!.childElementCount).toBe(4);
			done();
		});
	});
});
