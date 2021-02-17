import {Template} from './template'
import use from '../use'
import {ReactiveValue} from '../reactivity/reactive-value'

describe('Template', () => {
  let root: HTMLElement

  beforeEach(() => {
    root = document.createElement('div')
    const body = document.createElement('div')
    root.appendChild(body)
  })

  it('should render template string as html', () => {
    const innerHTML = `<span>hello, world</span>`
    const template = new Template(innerHTML, [])

    const _ = template.render(root.firstElementChild!)

    expect(root.firstElementChild?.innerHTML).toBe(`<span>hello, world</span>`)
  })

  it('should interpolate reactive values', () => {
    const dep = use('world')
    const innerHTML = `<span>hello, {{0}}</span>`
    const template = new Template(innerHTML, [dep])

    const _ = template.render(root.firstElementChild!)

    expect(root.firstElementChild?.innerHTML).toBe(`<span>hello, world</span>`)
  })

  it('should interpolate primitive values', () => {
    const innerHTML = `<div>{{0}} {{1}} {{2}}</div>`
    const template = new Template(innerHTML, ['foo', false, 123])

    const _ = template.render(root.firstElementChild!)

    expect(root.firstElementChild!.innerHTML).toBe(`<div>foo false 123</div>`)
  })

  it('should replace root node if replace param is set to true', () => {
    const innerHTML = `<span>foo</span>`
    const template = new Template(innerHTML, [])

    const _ = template.render(root.firstElementChild!, true)

    expect(root.innerHTML).toBe('<span>foo</span>')
  })

  it('should not replace root node if it doesnt have a parent node', () => {
    const innerHTML = `<span>foo</span>`
    const template = new Template(innerHTML, [])

    const _ = template.render(root, true)

    expect(root.innerHTML).not.toBe('<span>foo</span>')
  })

  it('should wrap inline functions in reactive contexts that update along with its deps', () => {
    const dep = new ReactiveValue(false)
    const innerHTML = `<span>{{0}}</span>`
    const template = new Template(innerHTML, [() => (dep.value ? 'foo' : 'bar')])

    const _ = template.render(root.firstElementChild!)

    expect(root.firstElementChild!.innerHTML).toBe('<span>bar</span>')

    dep.value = true

    expect(root.firstElementChild!.innerHTML).toBe('<span>foo</span>')
  })
})
