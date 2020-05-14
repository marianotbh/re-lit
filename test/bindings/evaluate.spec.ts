import { BindingContext, evaluate } from "../../src/bindings";

describe("evaluate", () => {
	it("should convert a expression string to its actual value given a context", () => {
		const expression = "hello";
		const bindingContext = BindingContext.from({
			hello: "world"
		});

		const result = evaluate(expression, bindingContext);

		expect(result).toBe("world");
	});

	it("should throw error when evaluating an invalid expression, like referring to a variable undefined in the bindingContext", () => {
		const expression = "someUndefinedVariable";
		const bindingContext = BindingContext.from({});

		const evaluation = () => {
			evaluate(expression, bindingContext);
		};

		expect(evaluation).toThrowError(/^failed to evaluate expression/);
	});

	it("should convert a expression string to its actual value given a context", () => {
		const expression = "1 + 1";
		const bindingContext = BindingContext.from({});

		const result = evaluate(expression, bindingContext);

		expect(result).toBe(2);
	});

	it("should be able to evaluate even arrow functions", () => {
		const expression = "() => 'evaluated function'";
		const bindingContext = BindingContext.from({});

		const result = evaluate(expression, bindingContext);

		expect(typeof result).toBe("function");
		expect(result()).toBe("evaluated function");
	});

	it("should be able to evaluate even string interpolations", () => {
		const expression = "`hello ${hello}`";
		const bindingContext = BindingContext.from({
			hello: "world"
		});

		const result = evaluate(expression, bindingContext);

		expect(result).toBe("hello world");
	});
});
