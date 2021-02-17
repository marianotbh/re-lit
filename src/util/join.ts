export type Tokenizer = (index: number) => string

export default function join(strings: string[], tokenizer: Tokenizer) {
  const initialValue = strings[0] ?? ''

  return strings.reduce((result, _, index) => {
    if (index + 1 === strings.length) return result

    return result + tokenizer(index) + strings[index + 1]
  }, initialValue)
}
