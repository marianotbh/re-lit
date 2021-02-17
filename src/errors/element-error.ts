export class ElementError extends Error {
  constructor(innerError: Error) {
    super()

    this.message = `
    Failed to create element: ${innerError.message}
    `
  }
}
