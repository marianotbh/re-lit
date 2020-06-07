import { handle } from "../handle";
import { apply } from "../apply";
import router, { Redirect, Reject } from "../../routing";

type RouteParams = { name: string; params?: object };

handle<RouteParams, HTMLElement>("router", {
	controlsChildren: true,
	onBind(_, node, context) {
		if (typeof globalThis.history.pushState === "undefined") {
			throw new Error("your browser does not support pushState, please use a decent browser");
		}

		let isResolving = false;

		const setRoute = async () => {
			const path = location.pathname.substr(1);

			const match = router.match(path);

			if (match !== null) {
				try {
					const [name, route] = match;
					const params = route.parse(path);

					const result = (await route.resolve(params)).filter(
						(r): r is object => typeof r !== "undefined"
					);

					apply(
						"component",
						node,
						() => ({
							name,
							params: mix(result)
						}),
						context
					);
				} catch (error) {
					if (error instanceof Redirect) {
					} else if (error instanceof Reject) {
					} else {
						throw error;
					}
				}
			} else {
				router.fallback();
			}
		};

		globalThis.addEventListener("popstate", async (_: PopStateEvent) => {
			setRoute();
		});

		setRoute();
	}
});

function mix(objs: object[]): object {
	return objs.reduce((ret, obj) => {
		return { ...ret, ...obj };
	}, {});
}
