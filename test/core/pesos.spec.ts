import $, { observable, computed, ref } from "../../src";

describe("pesos", () => {
	it("should create the give Template on the passed dom node", async () => {
		const whom = observable("world");
		const el = await $`<div>hello, ${whom}</div>`.render();

		expect(el).not.toBeNull();
		expect(el.textContent).toMatch(/hello, world/g);
	});

	it("should create the give Template on the passed dom node", async () => {
		const whom = observable("world");
		const el = await $`<div>hello, ${whom}</div>`.render();

		whom.value = "weni";

		expect(el.textContent).toMatch(/hello, weni/g);
	});

	it("should create the give Template on the passed dom node", async () => {
		const whom = observable("world");
		const childEl = $`<div>hello, ${whom}</div>`;
		const el = await $`<div>${childEl}</div>`.render();

		expect(el.textContent).toMatch(/hello, world/g);
	});

	it("should correctly display and update conditional renderings", async () => {
		const conditional = observable(true);
		const el = await $`<div>${() => (conditional.value ? $`true!!` : $`false!!`)}</div>`.render();

		expect(el.textContent).toMatch(/true!!/g);

		conditional.value = false;

		expect(el.textContent).toMatch(/false!!/g);
	});

	it("should correctly render attributes", async () => {
		const el = await $`<div ${{ id: "test", class: "testable" }}></div>`.render();

		expect(el.firstElementChild!.getAttribute("id")).toEqual("test");
		expect(el.firstElementChild!.getAttribute("class")).toEqual("testable");
	});

	it("should correctly render attributes", async () => {
		const id = observable("test");
		const classes = computed(() => id.value + "able");

		const el = await $`<div ${{ id, class: classes }}></div>`.render();

		expect(el.firstElementChild!.getAttribute("id")).toEqual("test");
		expect(el.firstElementChild!.getAttribute("class")).toEqual("testable");

		id.value = "changed";

		expect(el.firstElementChild!.getAttribute("id")).toEqual("changed");
		expect(el.firstElementChild!.getAttribute("class")).toEqual("changedable");
	});

	it("weniweni", async () => {
		const isLoading = observable(false);
		const classes = computed(() => "select" + (isLoading.value ? " is-loading" : ""));
		const button = observable<HTMLButtonElement | null>(null);

		function toggle() {
			debugger;
			isLoading.value = !isLoading.value;
		}

		const test = await $`
			<div ${{ class: classes }}></div>
			<button ${ref(button)} onclick=${toggle}>toggle</button>
		`.render();

		button.value!.click();

		expect(test.firstElementChild!.getAttribute("class")).toBe("select is-loading");
	});

	it("should correctly render attributes", async () => {
		const options = observable([
			{ text: "one", value: 1 },
			{ text: "two", value: 2 },
			{ text: "three", value: 3 }
		]);

		const el = await $`
			<select>
				<option>pick one</option>
				${() => options.value.map(({ value, text }) => $`<option ${{ value }}>${text}</option>`)}
			</select>`.render();

		expect(el.firstElementChild!.childElementCount).toBe(4);
	});
});
