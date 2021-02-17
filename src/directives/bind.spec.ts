import {ReactiveValue} from '../reactivity/reactive-value'
import bind from './bind'

describe('bind directive', () => {
  it('should set the input value to the reactive value', () => {
    const reactiveValue = new ReactiveValue('foo')
    const input = document.createElement('input')

    bind(reactiveValue)(input)

    expect(input.value).toBe('foo')
  })

  it('should use the checked property for checkboxes', () => {
    const reactiveValue = new ReactiveValue('foo')
    const input = document.createElement('input')
    input.type = 'checkbox'

    bind(reactiveValue)(input)

    expect(input.checked).toBe(true)

    reactiveValue.value = ''

    expect(input.checked).toBe(false)
  })

  it('should also set the reactive value when the input changes', () => {
    const reactiveValue = new ReactiveValue('foo')
    const input = document.createElement('input')

    bind(reactiveValue)(input)

    input.value = 'bar'
    input.dispatchEvent(new Event('change'))

    expect(reactiveValue.value).toBe('bar')
  })
})
