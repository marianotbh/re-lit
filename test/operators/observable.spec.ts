import { observable } from "../../src/operators";

test("observable should return an observable instance", () => {
	const subscribable = observable(1);
	expect(subscribable.value).toBe(1);
});

test("value change should trigger subscription", done => {
	const subscribable = observable(1);

	const sub = subscribable.subscribe(val => {
		expect(subscribable.value === val).toBeTruthy();
		sub.dispose();
		done();
	});

	subscribable.value = 2;
});
