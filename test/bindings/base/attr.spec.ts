import { apply, observable, snap, computed } from "../../../src";

describe("attr handler", () => {
	it("should set the elements attribute correctly", async () => {
		// act
		const node = document.createElement("div");
		const obj = { id: observable(1) };

		// arrange
		await apply(
			"attr",
			node,
			computed(() => obj)
		);

		// assert
		expect(node.getAttribute("id")).toBe("1");
		obj.id.value = 2;
		expect(node.getAttribute("id")).toBe("2");
	});
});
