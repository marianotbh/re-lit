type DisposeCallback = () => void

type Subscription<T = unknown> = (value: T) => void | DisposeCallback

type Updater<T> = (value: T) => T | void
