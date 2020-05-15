import { apply } from "../../../src/bindings";

describe("event handler", () => {
	it("should add an event listener to the node", async done => {
		const node = document.createElement("button");

		await apply("event", node, () => ({
			click: () => {
				done();
			}
		}));

		node.click();
	});
});
