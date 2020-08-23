import { pool, ripple } from "../../src/operators/pool";

describe("pool operator", () => {
	it("should capture all of the functions passed as a callback when ripple is invoked and return a function that executes all of those callbacks when invoked", () => {
		let invokedFirstRipple = false;
		let invokedSecondRipple = false;
		let invokedThirdRipple = false;

		const clear = pool(() => {
			ripple(() => (invokedFirstRipple = true));
			ripple(() => (invokedSecondRipple = true));
			ripple(() => (invokedThirdRipple = true));
		});

		clear();

		expect(invokedFirstRipple).toBeTruthy();
		expect(invokedSecondRipple).toBeTruthy();
		expect(invokedThirdRipple).toBeTruthy();
	});
});
