import { Operator } from "../operators/operator";

const frames: Array<Operator<any>> = [];

const tracker = new Map<Operator<any>, Set<Operator<any>>>();

export function wake(operator: Operator<any>): void {
	if (frames.includes(operator)) {
		throw new Error("circular dependency detected");
	}

	if (!tracker.has(operator)) {
		tracker.set(operator, new Set());
	}

	frames.unshift(operator);
}

export function sleep(): void {
	if (frames.length) {
		frames.shift();
	}
}

export function touch(operator: Operator<any>): void {
	if (frames.length && tracker.size) {
		tracker.get(frames[0])!.add(operator);
	}
}

export function collect(operator: Operator<any>) {
	return Array.from(tracker.get(operator) ?? []);
}

export function dispose(operator: Operator<any>) {
	if (tracker.has(operator)) {
		tracker.delete(operator);
	}
}
