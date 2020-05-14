import { BindingContext, apply, bind } from "../../../src/bindings";
import { defineComponent } from "../../../src/components";
import { observable } from "../../../src/operators";

type Todo = {
	id: number;
	text: string;
	done: boolean;
};

defineComponent<{ todo: Todo }>("iterated-component", {
	template: `<label><input type="checkbox" @change="toggle" />#{{id}} - {{text}}</label>`,
	viewModel: ({ todo, ref }) => {
		return {
			...todo,
			toggle() {
				ref.dispatchEvent(new CustomEvent("complete", { detail: { id: todo.id } }));
			}
		};
	}
});

describe("for handler", () => {
	it("should repeat innerHTML of the element for every item in the passed array", async () => {
		// arrange
		const el = document.createElement("div");
		el.innerHTML = `<span>{{ item }}</span>`;
		const array = ["foo", "bar", "baz"];
		const context = BindingContext.from({ array });

		// act
		await apply("for", el, () => "array as item", context);

		// assert
		expect(el.childNodes.length).toEqual(array.length);
		expect(
			[...el.childNodes.values()].map(child => {
				if (child instanceof HTMLElement) {
					return child.textContent.trim();
				}
			})
		).toEqual(array);
	});

	it("should bind iterated components correctly", async () => {
		const el = document.createElement("div");
		el.innerHTML = `
            <ul :for="todos as todo">
                <iterated-component $todo></iterated-component>
            </ul>
        `;

		expect(
			bind(
				el,
				BindingContext.from({
					todos: observable(
						new Array<Todo>(
							{ id: 1, text: "laundry", done: false },
							{ id: 2, text: "groceries", done: false },
							{ id: 3, text: "homework", done: false },
							{ id: 4, text: "excercise", done: false }
						)
					)
				})
			)
		).resolves.toBeUndefined();
		expect(el.firstElementChild.childElementCount).toBe(4);
	});
});
