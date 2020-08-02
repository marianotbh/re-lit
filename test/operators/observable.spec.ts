import { observable, isObservable } from "../../src/operators";

test("isObservable", () => {
	expect(isObservable(1)).toBe(false);
	expect(isObservable("not computed")).toBe(false);
	expect(isObservable(true)).toBe(false);
	expect(isObservable(false)).toBe(false);
	expect(isObservable(null)).toBe(false);
	expect(isObservable(undefined)).toBe(false);
	expect(isObservable(NaN)).toBe(false);
	expect(isObservable(observable<null>(null))).toBe(true);
});

test("observable should return an observable instance", () => {
	const subscribable = observable(1);
	expect(subscribable.value).toBe(1);
});

test("value change should trigger subscription", done => {
	const subscribable = observable(1);

	subscribable.subscribe(val => {
		expect(val).toBe(2);
		done();
	});

	subscribable.value = 2;
});
