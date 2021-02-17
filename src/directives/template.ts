import {Template, TemplateValue} from '../html/template'
import {ReactiveContext} from '../reactivity/reactive-context'
import {isReactive} from '../util/is-reactive'
import text from './text'

export default function template(value: TemplateValue): Ref {
  return node => {
    if (isReactive(value)) {
      return text(value)(node)
    } else if (typeof value === 'function') {
      if (isNodeRef(value)) {
        return value(node)
      } else {
        return processInlineFns(value, node)
      }
    } else if (value instanceof Template) {
      node = value.render(node, true)
    } else {
      node.textContent = String(value)
    }
  }
}

function processInlineFns(value: () => TemplateValue, node: Node) {
  const ctx = new ReactiveContext(value)

  let cleanup = template(ctx.value)(node)

  ctx.subscribe(value => {
    if (cleanup) {
      cleanup()
    }

    cleanup = template(value)(node)
  })

  return () => {
    ctx.dispose()

    if (cleanup) {
      cleanup()
    }
  }
}

function isNodeRef(fn: Function): fn is Ref {
  return fn.length === 1
}
