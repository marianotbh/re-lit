export class IncompatibilityError extends Error {
  constructor(feature: string) {
    super()

    this.message = `
    This library needs to run on a browser that supports ${feature}.
    If your need to support this browser, try implementing a polyfill for this global object.
    `.trim()
  }
}
