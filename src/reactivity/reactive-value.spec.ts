import {ReactiveContext} from './reactive-context'
import {ReactiveValue} from './reactive-value'
import {mocked} from 'ts-jest/utils'
import {NotInitializedError} from '../errors/not-initialized-error'

const mockReactiveContext = mocked(ReactiveContext, true)

jest.mock('./reactive-context', (): {ReactiveContext: Partial<ReactiveContext>} => ({
  ReactiveContext: {register: jest.fn()}
}))

describe('ReactiveValue', () => {
  afterEach(() => {
    mockReactiveContext.register.mockClear()
  })

  it('return initial value passed in constructor through its value getter', () => {
    const reactiveValue = new ReactiveValue(1)

    expect(reactiveValue.value).toBe(1)
  })

  it('should throw when reading value before it was initialized', () => {
    const reactiveValue = new ReactiveValue()

    expect(() => reactiveValue.value).toThrowError(NotInitializedError)
  })

  it('should return update value when value getter is assigned', () => {
    const reactiveValue = new ReactiveValue<number>()

    reactiveValue.value = 1

    expect(reactiveValue.value).toBe(1)
  })

  it('should register dependency in reactive context when using value getter', () => {
    const reactiveValue = new ReactiveValue(1)

    const value = reactiveValue.value

    expect(value).toBe(1)
    expect(ReactiveContext.register).toHaveBeenCalledWith(reactiveValue)
  })

  it('should return currentvalue through peek method without activating dependencies tracking', () => {
    const reactiveValue = new ReactiveValue(1)

    const value = reactiveValue.peek()

    expect(value).toBe(1)
    expect(ReactiveContext.register).not.toHaveBeenCalled()
  })
})
