import { Subscription } from "../../src/operators/subscription";

describe("subscription", () => {
	it("should invoke its subscriber when updated", done => {
		const subscription = new Subscription<number>(val => {
			expect(val).toEqual(123);
			done();
		});

		subscription.update(123);
	});
});
