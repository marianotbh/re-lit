import { Subscription } from "../../src/subscribables";

test("subscription", () => {
	let someValue = 0;

	// subscriber is the callback function that will be invoked everytime the update() method is called
	const subscriber = (val: number) => {
		someValue = val;
	};

	// disposeCallback will be invoked when the dispose() method of the Subscription is called
	const disposeCallback = () => {
		someValue = 1;
	};
	const sub = new Subscription<number>(subscriber, disposeCallback);

	sub.update(123);

	expect(someValue).toBe(123);

	sub.dispose();

	expect(sub.isDisposed).toBeTruthy();
	expect(someValue).toBe(1);
});
