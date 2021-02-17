import {Template, TemplateValue} from './template'
import join from '../util/join'

export default function html(templateStringsArray: TemplateStringsArray, ...args: TemplateValue[]) {
  const innerHTML = join(Array.from(templateStringsArray.values()), index => `{{${index}}}`)

  return new Template(innerHTML, args)
}
