export class Redirect {
	constructor(public route: string, public params: object = {}) {}

	static async to(route: string, params: object = {}): Promise<Redirect> {
		const redirect = new Redirect(route, params);
		return Promise.reject(redirect);
	}
}
