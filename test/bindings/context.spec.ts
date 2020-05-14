import { BindingContext } from "../../src/bindings";

test("a new binding context should have equal root and vm property and null parents", () => {
	const ctxt = new BindingContext({});

	expect(ctxt.vm).toBe(ctxt.root);
	expect(ctxt.parent).toBeNull();
	expect(ctxt.parentContext).toBeNull();
	expect(ctxt.parents.length).toBe(0);
});

test("createChild should return a child context whose parent is the context that called the method in the first place", () => {
	const rootContext = new BindingContext({});

	const childContext = rootContext.createChild({});

	expect(childContext.parentContext).toBe(rootContext);
	expect(childContext.parent).toBe(rootContext.vm);
	expect(childContext.parents.length).toBe(1);
	expect(childContext.parents[0]).toBe(rootContext.vm);
});

test("get should get the value of a property in the context", () => {
	const vm = {};
	const ctxt = new BindingContext(vm);

	const result = ctxt.get("root");

	expect(result).toBe(vm);
});

test("set should set a new property to the existing context", () => {
	const ctxt = new BindingContext({});

	ctxt.set("someprop", 123);

	expect(ctxt.hasOwnProperty("someprop")).toBe(true);
	expect(ctxt.get("someprop")).toBe(123);
});

test("extend should return a new binding context that is the result of the combination between the passed object and itself", () => {
	const ctxt = new BindingContext({});

	const extendedContext = ctxt.extend({ newProp: 123 });

	expect(extendedContext).toEqual({ ...ctxt, ...{ newProp: 123 } });
});
