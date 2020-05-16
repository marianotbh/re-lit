export function pipe(...args: any[]) {
	return function (...fns: Function[]) {
		return fns.reduce((args, fn) => {
			return fn(...args);
		}, args);
	};
}
