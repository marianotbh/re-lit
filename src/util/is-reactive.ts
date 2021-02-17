import {ReactiveContext} from '../reactivity/reactive-context'
import {ReactiveValue} from '../reactivity/reactive-value'

export function isReactive<T>(it: unknown): it is ReactiveValue<T> | ReactiveContext<T> {
  return it instanceof ReactiveValue || it instanceof ReactiveContext
}
