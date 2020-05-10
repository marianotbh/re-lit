type DisposeCallback = (node: Node) => void;

type AttachedDomData = Set<DisposeCallback>;

const domData = new WeakMap<Node, AttachedDomData>();

export function trackDOM(root: Node) {
	const observer = new MutationObserver(function (mutations) {
		mutations
			.filter(mutation => mutation.type === "childList")
			.forEach(({ removedNodes }) => {
				removedNodes.forEach(removedNode => {
					if (nodeHasData(removedNode)) {
						disposeNode(removedNode);
					}
				});
			});
	});

	observer.observe(root, { childList: true, subtree: true });

	addDisposeCallback(root, () => {
		observer.disconnect();
	});
}

export function addDisposeCallback(node: Node, callback: DisposeCallback) {
	if (domData.has(node)) {
		domData.get(node)?.add(callback);
	} else {
		domData.set(node, new Set([callback]));
	}
}

export function nodeHasData(node: Node): boolean {
	return domData.has(node);
}

export function getNodeData(node: Node) {
	return domData.get(node) ?? null;
}

export function disposeNode(node: Node) {
	if (domData.has(node)) {
		domData.get(node)?.forEach(cb => cb(node));
		domData.delete(node);
	}
}
