import { apply, BindingContext } from "../../../src/bindings";

describe("interpolate handler", () => {
	it("should interpolate binding context with text node", async () => {
		const el = document.createElement("div");
		const bindingContext = new BindingContext({ who: "world" });
		el.textContent = "hello {{ who }}";

		await apply("interpolate", el.firstChild, null, bindingContext);

		expect(el.textContent).toBe("hello world");
	});

	it("should not do anything if text doesnt have any expressions surrounded by double brackets", async () => {
		const el = document.createElement("div");
		const bindingContext = new BindingContext({});
		el.textContent = "hello i'm a boring string!!";

		await apply("interpolate", el.firstChild, null, bindingContext);

		expect(el.textContent).toBe("hello i'm a boring string!!");
	});
});
