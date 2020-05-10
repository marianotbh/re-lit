export function createTemplate(templateString: string) {
	const template = document.createElement("template");

	template.innerHTML = templateString;

	return document.importNode(template.content, true);
}
