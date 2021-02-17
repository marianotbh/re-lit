import {ElementContext} from '../elements/element-context'
import {ReactiveContext} from '../reactivity/reactive-context'

export default function run(action: () => void | CleanUpCallback) {
  const reactiveContext = new ReactiveContext(action)

  let cleanupCallback = reactiveContext.value

  reactiveContext.subscribe(cleanup => {
    if (cleanupCallback) {
      cleanupCallback()
    }

    cleanupCallback = cleanup
  })

  ElementContext.register({
    dispose() {
      reactiveContext.dispose()

      if (cleanupCallback) {
        cleanupCallback()
      }
    }
  })
}
