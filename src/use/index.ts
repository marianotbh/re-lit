import {ReactiveValue} from '../reactivity/reactive-value'
import {ReactiveContext} from '../reactivity/reactive-context'
import {ElementContext} from '../elements/element-context'
import check from '../util/check'

function use<T>(it: () => T): ReactiveContext<T>
function use<T>(it: T): ReactiveValue<T>
function use<T>(it?: T | (() => T)) {
  let value: ReactiveContext<T> | ReactiveValue<T>

  if (check<() => T>(it, typeof it === 'function')) {
    value = new ReactiveContext<T>(it)
  } else {
    value = new ReactiveValue<T>(it)
  }

  ElementContext.register(value)

  return value
}

export default use
