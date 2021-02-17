import {ElementError} from '../errors/element-error'
import {ElementContext} from './element-context'
import type {Template} from '../html/template'

type NativeArguments = {
  child?: DocumentFragment
  children?: DocumentFragment[]
}

type Definition<P extends {} = {}> = (args: P & NativeArguments) => Template

export default function defineElement<P extends {} = {}>(definition: Definition<P>) {
  return (props: P) => {
    try {
      let element: Template
      const elementContext = new ElementContext()

      elementContext.execute(() => {
        element = definition(props)
      })

      return element!
    } catch (error) {
      throw new ElementError(error)
    }
  }
}
