import { apply } from "../../../src/bindings";

describe("text handler", () => {
	it("should set the element's textContent", async () => {
		// arrange
		const textContent = "some text";
		const el = document.createElement("span");

		// act
		await apply("text", el, () => textContent);

		// assert
		expect(el.textContent).toBe(textContent);
	});
});
