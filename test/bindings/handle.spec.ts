import { handle, isHandled, Handler } from "../../src/bindings";

describe("handle", () => {
	it("should register a binding handler", () => {
		// arrange
		const handlerName = "test-handler";
		const handler: Handler<string> = {
			onBind: () => {},
			onUpdate: () => {}
		};

		expect(isHandled(handlerName)).toBeFalsy();

		handle(handlerName, handler);

		expect(isHandled(handlerName)).toBeTruthy();
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
