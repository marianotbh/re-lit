import {InvalidTemplateError} from '../errors/invalid-template-error'
import {TemplateFactory} from './template-factory'

describe('TemplateFactory', () => {
  it('should create DocumentFragment from innerHTML passed', () => {
    const innerHTML = '<span>hello, world</span>'

    const template = TemplateFactory.fromString(innerHTML)

    expect(template.firstElementChild).not.toBe(null)
    expect(template.firstElementChild?.tagName).toBe('SPAN')
    expect(template.textContent).toBe('hello, world')
  })

  it('should throw when template does not contain an html element child', () => {
    const innerHTML = 'hello, world'

    const test = () => TemplateFactory.fromString(innerHTML)

    expect(test).toThrowError(InvalidTemplateError)
  })

  it('should throw when template does contains more than one root element', () => {
    const innerHTML = '<span>hello</span><span>world</span>'

    const test = () => TemplateFactory.fromString(innerHTML)

    expect(test).toThrowError(InvalidTemplateError)
  })
})
