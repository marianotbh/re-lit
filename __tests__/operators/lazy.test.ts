import { html, lazy } from "../../src";

describe("lazy operator", () => {
	it("should render the corresponding template after awaiting its result", async () => {
		const TestLazyTemplate = lazy(() =>
			Promise.resolve({
				default: (text: string) => html`<div>hello, ${text}</div>`
			})
		);

		const result = await TestLazyTemplate("world");

		expect(result.textContent).toBe("hello, world");
	});
});
