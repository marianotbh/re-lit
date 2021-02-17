import {ReactiveValue} from '../reactivity/reactive-value'
import text from './text'

describe('text directive', () => {
  it('should set the nodes textContext to the reactive value', () => {
    const element = document.createElement('div')
    const reactiveValue = new ReactiveValue('foo')

    text(reactiveValue)(element)

    expect(element.textContent).toBe('foo')
  })

  it('should update the nodes text content when the reactive value changes', () => {
    const element = document.createElement('div')
    const reactiveValue = new ReactiveValue('foo')

    text(reactiveValue)(element)

    expect(element.textContent).toBe('foo')

    reactiveValue.value = 'bar'

    expect(element.textContent).toBe('bar')
  })
})
