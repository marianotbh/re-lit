type AttributeObject = Record<string, string | null>;

export function attr(node: HTMLElement) {
	return function (attrs: AttributeObject) {
		Object.entries(attrs).forEach(([name, value]) => {
			if (value === null) {
				node.removeAttribute(name);
			} else {
				if (node.hasAttribute(name)) {
					if (node.getAttribute(name) !== value) {
						node.setAttribute(name, value);
					}
				} else {
					node.setAttribute(name, value);
				}
			}
		});
	};
}
