import { cause, compose, effect, observe } from "../../src";
import { publish } from "../../src/operators/subscribe";

describe("effect operator", () => {
	it("should execute the effect everytime one of its dependencies publishes a new value", () => {
		// declare the dependency object
		const dep = { foo: "bar" };

		let timesTheEffectWasEvaluated = 0;

		effect(() => {
			// inside the effect function, declare the dependency object as a cause for the effect,
			// this function is invoked internally everytime you read an observable or composed value
			cause(dep);

			// increment the amount of times the effect was called
			timesTheEffectWasEvaluated++;
		});

		// publishes a value update for the dep object, 1 is the new value but it's not used for this test,
		// this function is invoked internally everytime you set an observable value or the value of a composed value is updated
		publish(dep, 1);

		// expected value is 2 because the effect always runs once when it is declared
		// and then another time from invoking publish on one of its dependencies
		expect(timesTheEffectWasEvaluated).toBe(2);
	});

	it("should execute the effect everytime one of its dependencies publishes a new value", () => {
		// declare the dependency object.
		const foo = observe(1);

		let iShouldBeATenInTheEnd = 0;

		effect(() => {
			// inside the effect's function, use the observable's value to trigger the dependency tracking
			// (iShouldBeATenInTheEnd += foo without using the value property will not have the desired effect).
			iShouldBeATenInTheEnd += foo.value;
		});

		// reassign foo's value, which will also reassign bar's value
		foo.value = 9;

		// expected value is 10 because the first time foo's and bar's values are summed the result is 3 (1 + (1 + 1))
		// and then, when foo's value is reassigned, the effect is ran again and the new sum is (3 + (3 + 1)) = 7,
		// plus the earlier result (3), the final result is a 3, demonstrating an effect's function is run everytime
		// one of it's dependencies changes.
		expect(iShouldBeATenInTheEnd).toBe(10);
	});
});
