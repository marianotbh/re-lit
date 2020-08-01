import { Subscribable } from "../operators/subscribable";
import { Computed } from "../operators/computed";

const frames: Array<Computed> = [];

export function wake(subscribable: Computed<any>): void {
	frames.unshift(subscribable);
}

export function sleep(): void {
	if (frames.length) {
		frames.pop();
	}
}

export function touch(subscribable: Subscribable<any>): void {
	if (frames.length) {
		frames[0].sync(subscribable);
	}
}
