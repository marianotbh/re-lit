import {DirectiveError} from '../errors/directive-error'
import type {ReactiveValue} from '../reactivity/reactive-value'

export default function bind(reactive: ReactiveValue, eventType = 'change'): Ref {
  return node => {
    const listener = createListener(reactive)

    node.addEventListener(eventType, listener)

    const subscription = reactive.subscribe(value => {
      setValue(node, value)
    })

    setValue(node, reactive.value)

    return () => {
      node.removeEventListener(eventType, listener)
      reactive.unsubscribe(subscription)
    }
  }
}

const createListener = (
  reactiveValue: ReactiveValue
): EventListener | EventListenerObject => ev => {
  if (ev.currentTarget !== null) {
    const value = getValue(ev.currentTarget)
    reactiveValue.value = value
  }
}

const getValue = (target: EventTarget) => {
  if (isCheckbox(target)) {
    return target.checked
  } else if (isInput(target) || isSelect(target)) {
    return target.value
  } else {
    throw new DirectiveError(
      bind.name,
      target as Node,
      'Should be applied on <input/> or <select>...<select/> elements.'
    )
  }
}

const setValue = (node: Node, value: unknown) => {
  if (isCheckbox(node)) {
    node.checked = Boolean(value)
  } else if (isInput(node) || isSelect(node)) {
    node.value = String(value)
  } else {
    throw new DirectiveError(
      bind.name,
      node,
      'Should be applied on <input/> or <select>...<select/> elements.'
    )
  }
}

const isCheckbox = (node: Node | EventTarget): node is HTMLInputElement => {
  return node instanceof HTMLInputElement && node.type === 'checkbox'
}

const isInput = (node: Node | EventTarget): node is HTMLInputElement => {
  return node instanceof HTMLInputElement && node.type !== 'checkbox'
}

const isSelect = (node: Node | EventTarget): node is HTMLSelectElement => {
  return node instanceof HTMLSelectElement
}
