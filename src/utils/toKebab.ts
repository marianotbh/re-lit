export function toKebab(s: string) {
	return s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
