export function pipe(...fns: Function[]) {
	return function (...args: any[]) {
		return fns.reduce((args, fn) => {
			return fn(...args);
		}, args);
	};
}
