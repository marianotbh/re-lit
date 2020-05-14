import { batch } from "../../src/bindings";

describe("batch", () => {
	it("should return null if no handler is set", () => {
		const node = document.createElement("div");

		const result = batch(node);

		expect(result).toBe(null);
	});

	it("should return all handlers for a node", () => {
		const node = document.createElement("div");
		node.innerHTML = `<div :component="{ name: 'some-component' }" id={{1}} @click="sayHello"></div>`;

		const result = batch(node.firstElementChild);

		expect(result).not.toBe(null);
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBe(3);
		expect(result[0]).toEqual(["component", "{ name: 'some-component' }"]);
		expect(result[1]).toEqual(["attr", "{ id: 1 }"]);
		expect(result[2]).toEqual(["event", "{ click: sayHello }"]);
	});

	it("should return all handlers for a node", () => {
		const node = document.createTextNode(`hello, {{world}}`);

		const result = batch(node);

		expect(result).not.toBe(null);
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBe(1);
		expect(result[0]).toEqual(["interpolate", "null"]);
	});
});
