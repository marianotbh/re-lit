import { Subscribable } from "../operators/subscribable";
import { Computed } from "../operators/computed";

type CurrentFrame<T = unknown> = Computed<T> | null;

let current: CurrentFrame = null;
const frames: Array<Computed> = [];

export function wake<T = unknown>(subscribable: Computed<T>): void {
	if (current !== null) {
		frames.push(current);
	}

	current = subscribable;
}

export function sleep(): void {
	if (frames.length > 0) {
		current = frames.pop() ?? null;
	} else {
		current = null;
	}
}

export function touch(subscribable: Subscribable): void {
	if (current !== null) {
		current.sync(subscribable);
	}
}
