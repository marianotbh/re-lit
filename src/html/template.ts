import {MissingArgError} from '../errors/missing-arg-error'
import {ReactiveContext} from '../reactivity/reactive-context'
import type {ReactiveValue} from '../reactivity/reactive-value'
import {RenderContext} from '../render/render-context'
import {TemplateFactory} from './template-factory'
import template from '../directives/template'

const MATCH_PLACEHOLDER = /{{([0-9]*)}}/g
const MATCH_NUMERIC = /[^0-9]/g

export type TemplateValue =
  | string
  | number
  | boolean
  | null
  | Template
  | ReactiveValue
  | ReactiveContext
  | Ref
  | (() => TemplateValue)

export class Template {
  private readonly cleanupCallbacks: Set<CleanUpCallback>

  constructor(private readonly innerHTML: string, private readonly args: TemplateValue[]) {
    this.cleanupCallbacks = new Set()
  }

  render(root: Node, replaceRoot = false) {
    const template = TemplateFactory.fromString(this.innerHTML)

    if (replaceRoot && root.parentElement !== null) {
      root.parentElement.replaceChild(template, root)
    } else {
      root.appendChild(template)
    }

    RenderContext.register(template, () => {
      this.dispose()
    })

    this.process(template)

    return template
  }

  dispose() {
    this.cleanupCallbacks.forEach(cleanupCallback => {
      cleanupCallback()
    })

    this.cleanupCallbacks.clear()
  }

  private getArg(token: string) {
    const stringIndex = token.replace(MATCH_NUMERIC, '')
    const index = Number(stringIndex)
    const arg = this.args[index]

    if (typeof arg === 'undefined') {
      throw new MissingArgError(index)
    }

    return arg
  }

  private process(node: Node) {
    if (node instanceof HTMLElement) {
      if (node.attributes.length) {
        Array.from(node.attributes).forEach(attribute => {
          this.processAttribute(attribute)
        })
      }

      if (node.hasChildNodes()) {
        Array.from(node.childNodes).forEach(childNode => {
          this.process(childNode)
        })
      }
    }

    if (node instanceof Text) {
      this.processText(node)
    }
  }

  private processAttribute(attribute: Attr) {
    if (MATCH_PLACEHOLDER.test(attribute.name)) {
      const arg = this.getArg(attribute.name)

      if (typeof arg === 'function') {
        const cleanup = arg(attribute.ownerElement!)

        if (isCleanup(cleanup)) {
          this.cleanupCallbacks.add(cleanup)
        }
      }

      attribute.ownerElement?.removeAttribute(attribute.name)
    }
  }

  private processText(textNode: Text) {
    const matches = textNode.textContent?.matchAll(MATCH_PLACEHOLDER)

    console.log(Array.from(matches!), textNode.textContent)

    if (matches) {
      Array.from(matches).forEach(([match, capturedValue]) => {
        if (!match || !capturedValue || !textNode.textContent) return

        const matchIndex = textNode.textContent.indexOf(match)
        const node = textNode.splitText(matchIndex)

        textNode = node.splitText(match.length)

        const arg = this.getArg(capturedValue)

        const cleanup = template(arg)(node)

        if (cleanup) {
          this.cleanupCallbacks.add(cleanup)
        }
      })
    }
  }
}

function isCleanup(it: void | TemplateValue): it is CleanUpCallback {
  return typeof it === 'function' && it.length === 1
}
