import run from '.'
import {ElementContext} from '../elements/element-context'
import {ReactiveContext} from '../reactivity/reactive-context'
import {ReactiveValue} from '../reactivity/reactive-value'

describe('run', () => {
  it('should run the passed function when called', () => {
    const func = jest.fn()

    run(() => {
      func()
    })

    expect(func).toHaveBeenCalled()
  })

  it('should run clean-up function when a the function is re-run', () => {
    const dep = new ReactiveValue(1)
    const cleanup = jest.fn()

    run(() => {
      console.log(dep.value)

      return () => {
        cleanup()
      }
    })

    expect(cleanup).not.toHaveBeenCalled()

    dep.value = 2

    expect(cleanup).toHaveBeenCalled()
  })

  it('should call clean-up function when element context is dispose', () => {
    const ctxt = new ElementContext()

    const cleanup = jest.fn()
    const action = jest.fn(() => {
      return () => {
        cleanup()
      }
    })

    ctxt.execute(() => {
      run(action)
    })

    expect(action).toHaveBeenCalled()
    expect(cleanup).not.toHaveBeenCalled()

    ctxt.dispose()

    expect(cleanup).toHaveBeenCalled()
  })

  it('should call last clean-up function when action is called many times', () => {
    const ctxt = new ElementContext()

    const dep = new ReactiveValue('foo')

    const cleanup = jest.fn()

    const action = jest.fn(() => {
      console.log(dep.value)

      return () => {
        cleanup()
      }
    })

    ctxt.execute(() => {
      run(action)
    })

    expect(action).toHaveBeenCalled()
    expect(cleanup).not.toHaveBeenCalled()

    dep.value = 'bar'

    expect(action).toHaveBeenCalledTimes(2)
    expect(cleanup).toHaveBeenCalledTimes(1)

    ctxt.dispose()

    expect(action).toHaveBeenCalledTimes(2)
    expect(cleanup).toHaveBeenCalledTimes(2)
  })
})
