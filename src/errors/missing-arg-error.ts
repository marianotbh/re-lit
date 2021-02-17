export class MissingArgError extends Error {
  constructor(index: number) {
    super()

    this.message = `Missing argument value for interpolation at index ${index}.`
  }
}
