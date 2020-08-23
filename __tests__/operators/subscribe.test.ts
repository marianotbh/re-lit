import { dispose, once, publish, subscribe, unsubscribe } from "../../src/operators/subscribe";

describe("subscribe operator", () => {
	it("should invoke its callback when publish is invoked on the passed subscription subject", done => {
		const subject = {};

		subscribe(subject, val => {
			expect(val).toBe("foo");
			done();
		});

		publish(subject, "foo");
	});

	it("should not invoke its callback when the subscription has been revoked", () => {
		const subject = {};

		const sub = subscribe(subject, _ => {
			throw new Error("this should never happen");
		});

		unsubscribe(subject, sub);

		publish(subject, "foo");
	});

	it("should not invoke its callback when the subscription has been revoked", () => {
		const subject = {};

		subscribe(subject, _ => {
			throw new Error("this should never happen");
		});
		subscribe(subject, _ => {
			throw new Error("neither should this happen");
		});
		subscribe(subject, _ => {
			throw new Error("nor this one");
		});

		dispose(subject);

		publish(subject, "foo");
	});

	it("once should trigger the callback only one time, further publish invokations with that subject will be ignored", () => {
		const subject = {};

		let timesTheCallbackWasCalled = 0;

		once(subject, _ => {
			if (timesTheCallbackWasCalled > 1) throw new Error("this should never happen");
			timesTheCallbackWasCalled++;
		});

		publish(subject, "once");
		publish(subject, "twice");
		publish(subject, "thrice");

		expect(timesTheCallbackWasCalled).toBe(1);
	});
});
