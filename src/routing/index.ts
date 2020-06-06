import { Observable } from "../subscribables";

type Guard = {};

type RouteOptions = {
	path: string;
	component: string;
	guard: Guard[];
};

class Route {
	constructor(options: RouteOptions) {}
}

class Router {
	private routes: Map<string, Route>;
	private activeRoute: Observable<Route | null>;
	private static instance: Router;

	constructor() {
		this.routes = new Map();
		this.activeRoute = new Observable(null);
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new Router();
		}

		return this.instance;
	}

	get currentRoute(): Route | null {
		return this.activeRoute.value;
	}

	set currentRoute(val: Route | null) {
		this.activeRoute.value = val;
	}

	go(routeName: string) {
		const route = this.routes.get(routeName);

		if (route) {
			this.currentRoute = route;
		}
	}

	add(routeName: string, routeOptions: RouteOptions): Router {
		this.routes.set(routeName, new Route(routeOptions));
		return this;
	}
}
