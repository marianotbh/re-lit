export class NotInitializedError extends Error {
  constructor() {
    super()

    this.message = `
    Reading reactive value before it was initialized.
    `.trim()
  }
}
