import {ReactiveContext} from './reactive-context'
import {Subscribable} from './subscribable'
import produce from 'immer'
import {NotInitializedError} from '../errors/not-initialized-error'

/**
 * class to store a primitive value and subscribe to its updates.
 */
export class ReactiveValue<T = any> extends Subscribable<T> {
  private currentValue?: T

  constructor(initialValue?: T) {
    super()
    this.currentValue = initialValue
  }

  /**
   * get or set the target's value.
   */
  get value(): T {
    if (typeof this.currentValue === 'undefined') {
      throw new NotInitializedError()
    }

    ReactiveContext.register(this)

    return this.currentValue
  }

  /**
   * get or set the target's value.
   */
  set value(value: T) {
    if (value !== this.currentValue) {
      this.currentValue = value

      this.publish(value)
    }
  }

  /**
   * reads the value without triggering any dependency detection.
   *
   * @example
   * const dep = use(1)
   * const ctx = use(() => 1 + dep.peek())
   *
   * console.log(ctx.value) // outputs: 2
   *
   * dep.value = 100
   *
   * // ctx never received dep's update.
   * console.log(ctx.value) // outputs: 2
   */
  peek(): T {
    if (typeof this.currentValue === 'undefined') {
      throw new NotInitializedError()
    }

    return this.currentValue
  }

  /**
   * sets the target's value without triggering updates in any dependency.
   * @param value value to set
   *
   * @example
   * const dep = use('world')
   * const ctx = use(() => `hello, ${dep.value}`)
   *
   * console.log(ctx.value) // output: "hello, world"
   *
   * // update dependency value through sneak:
   * dep.sneak('foo')
   *
   * console.log(ctx.value) // still outputs: "hello, world"
   */
  sneak(value: T) {
    this.currentValue = value
  }

  /**
   * updates the target value in a mutable way (uses immer under the hood).
   *
   * @param updater callback that receives the current value of the target.
   *
   * note: the updater should either return void or the new target's value.
   * @example
   * const target = use([])
   *
   * // ❌ DON'T do this:
   * target.update(value => value.push(1)) // Array.push returns the pushed item, so it will replace the target's array value with 1.
   *
   * // ✔ do this:
   * target.update(value => {
   *  value.push(1) // this function returns void so the return value of Array.push doesn't matter
   * })
   */
  update(updater: Updater<T>) {
    const currentValue = this.currentValue
    this.value = produce(currentValue, updater) as T
  }
}
