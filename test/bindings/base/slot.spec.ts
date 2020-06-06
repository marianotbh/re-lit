import { BindingContext, apply } from "../../../src/bindings";
import { createTemplate } from "../../../src/components/template";

describe("slot handler", () => {
	it("should apply the passed markup from the binding context to the bound element", async () => {
		const el = document.createElement("div");
		const bindingContext = BindingContext.from({});
		const slot = createTemplate(`<span>test template</span>`);
		bindingContext.slot = slot;

		await apply("slot", el, null, bindingContext);

		expect(el.innerHTML).toBe(slot.firstElementChild.outerHTML);
	});

	it("should apply the correct named slot to the parent element", async () => {
		const el = document.createElement("div");
		const bindingContext = BindingContext.from({});
		const slot = createTemplate(`
            <custom-slot>test template</custom-slot>
            <span>this element should not be part of the element's innerHTML</span>
        `);
		bindingContext.slot = slot;

		await apply("slot", el, () => "custom-slot", bindingContext);

		expect(el.innerHTML).toBe(slot.firstElementChild.outerHTML);
	});
});
