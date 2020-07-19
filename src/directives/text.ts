export function text(node: Node) {
	return function (value: unknown) {
		node.nodeValue = String(value);
	};
}
