import { Resolver, ResolverType, PossibleResolver } from "./resolver";
import { Observable } from "../operators/observable";

function sanitize(path: string) {
	if (path.startsWith("/")) path = path.substr(1);
	if (path.endsWith("/")) path = path.substring(0, path.length - 1);
	return path;
}

function isResolverType(obj: Function): obj is ResolverType {
	return obj.prototype instanceof Resolver;
}

export class Route {
	private segments: string[];
	public isActive: Observable<boolean>;
	private guard: Set<Resolver>;

	constructor(path: string) {
		this.segments = sanitize(path).split("/");
		this.isActive = new Observable(false);
		this.guard = new Set();
	}

	match(str: string): boolean {
		const segments = str.split("/");

		return (
			this.segments.length === segments.length &&
			this.segments.every((seg, idx) => /{(.*)}/.test(seg) || seg === segments[idx])
		);
	}

	use(resolver: PossibleResolver) {
		if (resolver instanceof Resolver) {
			this.guard.add(resolver);
		} else if (isResolverType(resolver)) {
			this.guard.add(new resolver());
		} else {
			this.guard.add({
				resolve(params: object) {
					return resolver(params);
				}
			});
		}
	}

	parse(path: string): object {
		debugger;
		const segments = path.split("/");

		return this.segments.reduce((obj, seg, idx) => {
			if (/{(.*)}/.test(seg)) {
				const prop = seg.match(/{(.*)}/)![1];
				const value = segments[idx];
				Object.defineProperty(obj, prop, {
					value,
					enumerable: true,
					configurable: true
				});
			}

			return obj;
		}, {});
	}

	async resolve(params: object) {
		debugger;
		if (this.guard.size === 0) {
			return Array.of(params);
		}

		return Promise.all(Array.from(this.guard).map(resolver => resolver.resolve(params)));
	}
}
