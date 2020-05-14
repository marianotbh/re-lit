import { Subscription } from "../../src/subscribables";

describe("subscription", () => {
	it("should invoke its subscriber when updated", done => {
		const subscription = new Subscription<number>(val => {
			expect(val).toEqual(123);
			done();
		});

		subscription.update(123);
	});

	it("should call dispose callback when dispose is invoked", done => {
		const subscription = new Subscription(
			() => {},
			() => {
				expect(subscription.isDisposed).toBe(true);
				done();
			}
		);

		subscription.dispose();
	});
});
