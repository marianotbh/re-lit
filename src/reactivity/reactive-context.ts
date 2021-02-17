import {SyncError} from '../errors/sync-error'
import {ReactiveValue} from './reactive-value'
import {Subscribable} from './subscribable'

/**
 * a reactive context is pretty much the same as a reactive value, only that its value
 * is composed by other reactive values. this is why its read-only, the value is updated automatically when its dependencies values update.
 */
export class ReactiveContext<T = any> extends Subscribable<T> {
  private currentValue?: T
  private isPristine: boolean
  private readonly dependencies: Map<ReactiveValue<any>, Subscription<any>>

  private static readonly activeContexts: ReactiveContext<any>[] = []

  constructor(private readonly context: () => T) {
    super()

    this.isPristine = true
    this.dependencies = new Map()
  }

  get value(): T {
    if (this.isPristine) {
      const update = this.update.bind(this)
      this.execute(update)

      this.isPristine = false
    }

    return this.currentValue!
  }

  get dependenciesCount(): number {
    return this.dependencies.size
  }

  static register(reactiveValue: ReactiveValue<any>) {
    const current = this.activeContexts[0]

    current?.register(reactiveValue)
  }

  register(reactiveValue: ReactiveValue<any>) {
    if (!this.dependencies.has(reactiveValue)) {
      const update = this.update.bind(this)
      const subscription = reactiveValue.subscribe(_ => {
        update()
      })

      this.dependencies.set(reactiveValue, subscription)
    }
  }

  update() {
    const value = this.context()

    if (value !== this.currentValue) {
      this.currentValue = value

      this.publish(value)
    }
  }

  dispose() {
    this.dependencies.forEach((subscription, value) => {
      value.unsubscribe(subscription)
    })

    super.dispose()
  }

  execute(action: () => void) {
    ReactiveContext.activeContexts.unshift(this)

    try {
      action()
    } finally {
      const current = ReactiveContext.activeContexts.shift()

      if (current !== this) {
        throw new SyncError()
      }
    }
  }
}
