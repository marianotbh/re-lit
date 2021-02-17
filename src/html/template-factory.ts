import {InvalidTemplateError} from '../errors/invalid-template-error'

export class TemplateFactory {
  private static templateCache: Map<string, HTMLTemplateElement> = new Map()

  static fromString(htmlString: string) {
    let template = this.templateCache.get(htmlString)

    if (!template) {
      template = document.createElement('template')
      template.innerHTML = htmlString

      if (template.content.childElementCount !== 1) {
        throw new InvalidTemplateError(template)
      }

      this.templateCache.set(htmlString, template)
    }

    const node = document.importNode(template.content, true)

    return node.firstElementChild!
  }
}
