export function text(node: Node) {
	return function (value: unknown) {
		node.textContent = String(value);
	};
}
