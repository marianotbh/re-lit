import type {ReactiveContext} from '../reactivity/reactive-context'
import type {ReactiveValue} from '../reactivity/reactive-value'

export default function text(reactive: ReactiveValue<string> | ReactiveContext<string>): Ref {
  return node => {
    node.textContent = String(reactive.value)

    const subscription = reactive.subscribe(value => {
      node.textContent = String(value)
    })

    return () => {
      reactive.unsubscribe(subscription)
    }
  }
}
