import use from '.'

describe('use', () => {
  it('should created a reactive value when passed a primitive object', () => {
    const primitiveReactive = use(1)

    expect(primitiveReactive.value).toBe(1)
  })

  it('should created a reactive value when passed a primitive object', () => {
    const primitiveReactive = use([1])

    primitiveReactive.update(x => {
      x.push(2)
    })

    expect(primitiveReactive.value).toEqual([1, 2])
  })

  it('should created a reactive value when passed a primitive object', () => {
    const primitiveReactive = use([1])

    primitiveReactive.update(_ => [2])

    expect(primitiveReactive.value).toEqual([2])
  })

  it('should create a readonly reactive value when passed a function', () => {
    const readonlyValue = use(() => 1)

    expect(readonlyValue.value).toBe(1)
  })

  it('should create a readonly reactive value when passed a function', () => {
    const greeting = use('hello')
    const target = use('world')
    const readonlyValue = use(() => `${greeting.value}, ${target.value}.`)

    expect(readonlyValue.value).toBe('hello, world.')
  })

  it('should create a readonly reactive value when passed a function', () => {
    const greeting = use('hello')
    const target = use('world')
    const readonlyValue = use(() => `${greeting.value}, ${target.value}.`)

    target.value = 'foo'

    expect(readonlyValue.value).toBe('hello, foo.')
  })
})
