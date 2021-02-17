export class SyncError extends Error {
  constructor() {
    super()

    this.message = `Context was corrupted.`
  }
}
