type RemoveCallback = (node: Node) => void;

const domData = new WeakMap<Node, Set<RemoveCallback>>();

export function trackDOM(root: Node) {
	if (typeof globalThis.MutationObserver === "undefined") {
		throw new Error("this library needs to run on a browser that supports mutation observer");
	}

	const observer = new MutationObserver(async mutations => {
		mutations
			.filter(mutation => mutation.type === "childList")
			.forEach(({ removedNodes }) => {
				removedNodes.forEach(removedNode => {
					disposeNode(removedNode);
				});
			});
	});

	observer.observe(root, { childList: true, subtree: true });

	onRemove(root, () => {
		observer.disconnect();
	});
}

export function onRemove(node: Node, callback: RemoveCallback) {
	let data = domData.get(node);

	if (!data) {
		domData.set(node, (data = new Set()));
	}

	data.add(callback);
}

export function disposeNode(node: Node) {
	const data = domData.get(node);

	if (data) {
		data.forEach(cb => cb(node));
		domData.delete(node);
	}
}
