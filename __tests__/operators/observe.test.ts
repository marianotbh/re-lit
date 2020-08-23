import { observe, isObservable } from "../../src";

describe("observe operator", () => {
	it("primitives should return false", () => {
		expect(isObservable(1)).toBeFalsy();
		expect(isObservable("not computed")).toBeFalsy();
		expect(isObservable(true)).toBeFalsy();
		expect(isObservable(false)).toBeFalsy();
		expect(isObservable(NaN)).toBeFalsy();
	});

	it("observables should return true", () => {
		expect(isObservable(observe(1))).toBeTruthy();
		expect(isObservable(observe("not computed"))).toBeTruthy();
		expect(isObservable(observe(true))).toBeTruthy();
		expect(isObservable(observe(false))).toBeTruthy();
		expect(isObservable(observe(NaN))).toBeTruthy();
	});

	it("observable should return an observable instance", () => {
		const observable = observe(1);
		expect(observable.value).toBe(1);
	});

	it("value change should trigger subscription", done => {
		const observable = observe(1);

		observable.subscribe(val => {
			expect(val).toBe(2);
			done();
		});

		observable.value = 2;
	});
});
