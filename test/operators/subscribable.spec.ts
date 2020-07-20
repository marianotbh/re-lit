import { Subscribable } from "../../src/operators/subscribable";

/**
 * because subscribable is an abstract class we need to create a dummyclass to test it, theres not much logic behind it,
 * it only defines a "next" method which will be used in tests to invoke internally the "publish" method
 */
class DummyClass<T = unknown> extends Subscribable<T> {
	public next(value: T) {
		this.publish(value);
	}
}

test("subscribable", () => {
	const dummy = new DummyClass<number>();

	let counter = 0;

	// subscribe is triggered each time publish is called
	dummy.subscribe(val => (counter += val));

	// internally publishes the value 1
	dummy.next(1);
	dummy.next(1);
	dummy.next(1);

	expect(counter).toBe(3);
});

test("subscribable", () => {
	const dummy = new DummyClass<number>();

	let counter = 0;

	// subscribe is triggered each time publish is called
	dummy.subscribeOnce(val => (counter += val));

	// internally publishes the value 1
	dummy.next(1);
	dummy.next(1);
	dummy.next(1);

	expect(counter).toBe(1);
});
