import $, { ref, of } from "../../src";

describe("ref directive", () => {
	it("should correctly obtain the referenced node and save it in an observable", done => {
		const observable = of<HTMLSpanElement | null>(null);

		observable.once(node => {
			expect(node instanceof HTMLSpanElement).toBeTruthy();
			done();
		});

		const _ = $`<span ${ref(observable)}></span>`.render();
	});
});
