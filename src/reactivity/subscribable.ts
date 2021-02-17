/**
 * base subscribable class.
 * can be used as a stand-alone pub-sub system.
 */
export class Subscribable<T = any> {
  protected readonly subscriptions: Set<Subscription<T>>
  private readonly disposableCallbacks: Set<DisposeCallback>
  public isDisposed: boolean

  constructor() {
    this.subscriptions = new Set()
    this.disposableCallbacks = new Set()
    this.isDisposed = false
  }

  /**
   * subscribes to this subscribable's value updates.
   * @param subscription a callback that will be called everytime the publish method is called, receiving the published value.
   */
  subscribe(subscription: Subscription<T>) {
    if (!this.isDisposed) {
      this.subscriptions.add(subscription)
    }

    return subscription
  }

  /**
   * removes the subscription from the subscribable's publish targets
   * @param subscription
   */
  unsubscribe(subscription: Subscription<T>) {
    this.subscriptions.delete(subscription)
  }

  /**
   * publishes a new value for subscribers to execute their callbacks.
   * @param value the new value to publish
   */
  publish(value: T) {
    if (this.isDisposed) {
      return
    }

    this.clearDisposeCallbacks()

    this.subscriptions.forEach(subscription => {
      const disposeCallback = subscription(value)

      if (disposeCallback) {
        this.disposableCallbacks.add(disposeCallback)
      }
    })
  }

  /**
   * removes all subscriptions from the target and marks it as disposed,
   * meaning no other values will be able to subscribe to this target and no other
   * subscribers will be called when a new value is published.
   */
  dispose() {
    this.clearDisposeCallbacks()
    this.subscriptions.clear()
    this.isDisposed = true
  }

  private clearDisposeCallbacks() {
    this.disposableCallbacks.forEach(disposable => {
      disposable()
    })

    this.disposableCallbacks.clear()
  }
}
