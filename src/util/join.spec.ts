import join from './join'

describe('join', () => {
  it('should join all strings by the token defined', () => {
    const strings = ['hello', 'world']

    const result = join(strings, _ => ' ')

    expect(result).toBe('hello world')
  })

  it('should join all strings by the token defined with token result', () => {
    const strings = ['foo', 'bar', 'baz']

    const result = join(strings, index => `{{${index}}}`)

    expect(result).toBe('foo{{0}}bar{{1}}baz')
  })
})
