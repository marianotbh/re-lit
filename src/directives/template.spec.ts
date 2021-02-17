import {ReactiveValue} from '../reactivity/reactive-value'
import template from './template'

describe('template', () => {
  let node: Node

  beforeEach(() => {
    node = document.createElement('div')
  })

  it('should apply text directive if passed value is reactive', () => {
    const reactive = new ReactiveValue('hello world')

    const _ = template(reactive)(node)

    expect(node.textContent).toBe('hello world')
  })

  it('should wrap parameterless functions into readonly values and bind them', () => {
    const fn = () => 'foo'

    const _ = template(fn)(node)

    expect(node.textContent).toBe('foo')
  })

  it('should update template when deps change', () => {
    const dep = new ReactiveValue(false)
    const fn = () => (dep.value ? 'foo' : 'bar')

    const _ = template(fn)(node)

    expect(node.textContent).toBe('bar')

    dep.value = true

    expect(node.textContent).toBe('foo')
  })
})
