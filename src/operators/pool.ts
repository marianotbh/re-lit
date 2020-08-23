type Action = () => void;

const frames = Array<Set<Action>>();

export function pool(cb: Action) {
	const root = new Set<Action>();

	frames.unshift(root);

	cb();

	const deps = Array.from(frames.shift()!);

	return () => deps.forEach(dep => dep());
}

export function ripple(cb: Action) {
	if (frames.length) {
		frames[0].add(cb);
	}
}
