import { Route } from "./route";
import { PossibleResolver } from "./resolver";

type RouteOptions = {
	path: string;
	guard?: PossibleResolver | PossibleResolver[];
};

export function router() {
	return Router.getInstance();
}

export class Router {
	private routes: Map<string, Route>;
	private static instance: Router;

	constructor() {
		this.routes = new Map();
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new Router();
		}

		return this.instance;
	}

	add(name: string, { path, guard = [] }: RouteOptions): Router {
		const route = new Route(path);

		if (Array.isArray(guard)) {
			guard.forEach(g => {
				route.use(g);
			});
		} else {
			route.use(guard);
		}

		this.routes.set(name, route);

		return this;
	}

	match(path: string): [string, Route] | null {
		const routes = Array.from(this.routes.entries());

		const match = routes.find(([, route]) => route.match(path)) ?? null;

		return match;
	}

	go(path: string) {
		history.pushState({}, "", path);
		const ev = new PopStateEvent("popstate", {});
		dispatchEvent(ev);
	}

	fallback() {
		throw new Error("fallback!");
	}

	reject() {
		throw new Error("reject!");
	}
}
