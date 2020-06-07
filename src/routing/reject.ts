export class Reject {
	constructor(public reason: string) {}

	static async because(reason: string): Promise<Reject> {
		const reject = new Reject(reason);
		return Promise.reject(reject);
	}
}
