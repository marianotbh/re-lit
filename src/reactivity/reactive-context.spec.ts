import {ReactiveContext} from './reactive-context'
import {ReactiveValue} from './reactive-value'

describe('ReactiveContext', () => {
  it('should return the return value of the context function in its value getter', () => {
    const reactiveValueA = new ReactiveValue('hello')
    const reactiveValueB = new ReactiveValue('world')

    const reactiveContext = new ReactiveContext(
      () => `${reactiveValueA.value} ${reactiveValueB.value}`
    )

    expect(reactiveContext.value).toBe('hello world')
  })

  it('should update its value when dependencies change', () => {
    const reactiveValueA = new ReactiveValue('hello')
    const reactiveValueB = new ReactiveValue('world')

    const reactiveContext = new ReactiveContext(
      () => `${reactiveValueA.value} ${reactiveValueB.value}`
    )
    jest.spyOn(reactiveContext, 'update')

    reactiveValueB.value = 'foo'

    expect(reactiveContext.value).toBe('hello foo')
  })

  it('dependencies should be registered only once on the first read', () => {
    const reactiveValueA = new ReactiveValue('hello')

    const reactiveContext = new ReactiveContext(() => reactiveValueA.value)
    jest.spyOn(reactiveContext, 'update')

    expect(reactiveContext.dependenciesCount).toBe(0)

    const _firstRead = reactiveContext.value

    expect(reactiveContext.dependenciesCount).toBe(1)

    const _secondRead = reactiveContext.value

    expect(reactiveContext.update).toHaveBeenCalledTimes(1)
  })
})
