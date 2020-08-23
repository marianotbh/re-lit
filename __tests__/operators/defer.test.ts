import { defer, html } from "../../src";

describe("defer operator", () => {
	it("should return an effect for a template", done => {
		const template = html`<p>hello, world</p>`;
		const fallback = html`<p>loading...</p>`;

		const result = defer(
			new Promise(resolve => {
				setTimeout(() => {
					resolve(template);
				}, 1000);
			}),
			fallback
		);

		expect(result()?.textContent).toBe("loading...");

		setTimeout(() => {
			expect(result()?.textContent).toBe("hello, world");
			done();
		}, 1050);
	});
});
