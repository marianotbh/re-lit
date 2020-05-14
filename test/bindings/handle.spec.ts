import { handle, isHandled, Handler, getHandler } from "../../src/bindings";

test("getHandler should return null for an unhandled handler", () => {
	const handler = getHandler("unhandled-handler");

	expect(handler).toBe(null);
});

test("isHandled should return false for an unhandled handler", () => {
	const result = isHandled("unhandled-handler");

	expect(result).toBe(false);
});

describe("handle", () => {
	it("should register a binding handler", () => {
		// arrange
		const handlerName = "test-handler";
		const handler: Handler<string> = {
			onBind: () => {},
			onUpdate: () => {}
		};

		handle(handlerName, handler);

		expect(isHandled(handlerName)).toBe(true);
		expect(getHandler(handlerName)).toBe(handler);
	});

	it("should not admit invalid handler names", () => {
		// arrange
		const invalidHandlerNames = [
			"CamelCaseName",
			"-name-that-starts-or-ends-with-hyphen-",
			"name with space",
			"name_with@invalid'symbol??"
		];

		// act & assert
		for (const invalidHandlerName of invalidHandlerNames) {
			expect(() => {
				handle(invalidHandlerName, {});
			}).toThrowError("Invalid handler name");
		}
	});
});
