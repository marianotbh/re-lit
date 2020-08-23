import { onRemove } from "../dom";
import { pool } from "../operators/pool";

type NativeArguments = {
	child?: DocumentFragment;
	children?: DocumentFragment[];
};

type TemplateFn<TArgs extends {} = {}> = (args: TArgs & NativeArguments) => DocumentFragment;

export function createElement<TArgs extends {} = {}>(templateFn: TemplateFn<TArgs>) {
	return function (args: TArgs) {
		let template: DocumentFragment;

		try {
			const clear = pool(() => {
				template = templateFn(args);
			});

			let onRemoveRef: Node;

			if (template!.childElementCount > 1 || template!.firstElementChild === null) {
				onRemoveRef = document.createComment("*");
				template!.prepend(onRemoveRef);
			} else {
				onRemoveRef = template!.firstElementChild;
			}

			onRemove(onRemoveRef, () => {
				console.log("disposed", onRemoveRef);
				clear();
			});
		} catch (error) {
			console.error(`failed to create element: ${error}`);
		}

		return template!;
	};
}
