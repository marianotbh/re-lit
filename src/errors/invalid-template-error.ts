export class InvalidTemplateError extends Error {
  constructor(template: HTMLTemplateElement) {
    super()

    this.message = `
    Found child elements: ${template.childElementCount}.
    Please make sure the template you wrote has exactly one html element at its root.
    ${template.innerHTML}
    `.trim()
  }
}
