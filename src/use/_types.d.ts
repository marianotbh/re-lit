interface ReadonlyReactiveValue<T> {
  readonly value: T
}

interface WriteableReactiveValue<T> {
  value: T
  update(updater: (value: T) => T | void): void
}
