import { Subscribable } from "../../src/subscribables";

/**
 * because subscribable is an abstract class we need to create a dummyclass to test it, theres not much logic behind it,
 * it only defines a "next" method which will be used in tests to invoke internally the "publish" method
 */
class DummyClass<T = unknown> extends Subscribable<T> {
	public next(value: T, event: string = "change") {
		this.publish(value, event);
	}
}

test("subscribable", () => {
	const dummy = new DummyClass<number>();
	let changeCounter = 0;
	let updateCounter = 0;

	// subscribe is triggered each time publish is called on the "change" channel
	dummy.subscribe(val => (changeCounter += val), "change");
	// subscribe is triggered each time publish is called on the "update" channel
	dummy.subscribe(val => (updateCounter += val), "update");

	// internally publishes the value 1 on the "change" channel
	dummy.next(1, "change");
	dummy.next(1, "change");
	dummy.next(1, "change");

	dummy.next(1, "update");
	dummy.next(200, "update");

	expect(changeCounter).toBe(3);
	expect(updateCounter).toBe(201);
});
