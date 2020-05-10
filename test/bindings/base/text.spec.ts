import { BindingContext, bind } from "../../../src/bindings";

test("text handler", done => {
	const context = BindingContext.from({ hello: "world" });
	const container = document.createElement("div");
	container.innerHTML = `<span :text="hello"></span>`;
	bind(container, context).then(() => {
		const span = container.querySelector("span");
		expect(span?.textContent).toBe("world");
		done();
	});
});
