import { Subscribable, Computed } from "../subscribables";

type CurrentFrame<T = unknown> = Computed<T> | null;

let current: CurrentFrame = null;
const frames: Array<Computed> = [];

export function activate<T = unknown>(subscribable: Computed<T>): void {
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

export function capture(subscribable: Subscribable): void {
	if (current !== null) {
		current.attach(subscribable);
	}
}
