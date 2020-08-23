const subs = new WeakMap<{}, Set<(value: any) => void>>();

export function subscribe<T = unknown>(subject: {}, callback: (value: T) => void) {
	let subjectSubs = subs.get(subject);

	if (!subjectSubs) {
		subs.set(subject, (subjectSubs = new Set<(val: T) => void>()));
	}

	subjectSubs.add(callback);

	return callback;
}

export function once<T = unknown>(subject: {}, callback: (value: T) => void) {
	let subjectSubs = subs.get(subject);

	if (!subjectSubs) {
		subs.set(subject, (subjectSubs = new Set<(val: T) => void>()));
	}

	let fn = (value: T) => {
		callback(value);
		subjectSubs?.delete(fn);
	};

	subjectSubs.add(fn);

	return fn;
}

export function unsubscribe<T = unknown>(subject: {}, callback: (value: T) => void) {
	return subs.get(subject)?.delete(callback);
}

export function publish(subject: {}, value: {}) {
	subs.get(subject)?.forEach(cb => cb(value));
}

export function dispose(subject: {}) {
	return subs.delete(subject);
}
