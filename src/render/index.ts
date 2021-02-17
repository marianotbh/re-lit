import {RenderContext} from './render-context'
import type {Template} from '../html/template'

function render(template: Template, rootElement: HTMLElement) {
  const renderContext = new RenderContext(rootElement)
  renderContext.initialize()

  rootElement.innerHTML = ''
  const html = template.render(rootElement)

  return html
}

export default render
