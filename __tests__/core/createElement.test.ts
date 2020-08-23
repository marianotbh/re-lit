import { createElement, html } from "../../src";

const TestElement = createElement<{ text: string; href: string }>(({ text, href, ...rest }) => {
	function handleClick(ev: Event) {
		ev.preventDefault();
		ev.stopPropagation();
	}

	return html`<a ${{ href }} onclick=${handleClick}>${text}</a>`;
});

describe("createElement core function", () => {
	it("should render the returned html element in the passed function", () => {
		const test = TestElement({ text: "abc", href: "/test" });

		const a = test.firstElementChild;

		expect(a instanceof HTMLAnchorElement).toBeTruthy();
		expect(a?.textContent).toBe("abc");
		expect(a?.getAttribute("href")).toBe("/test");
	});
});
