import {SyncError} from '../errors/sync-error'

export class ElementContext {
  private readonly dependencies: Set<Disposable>

  private static activeContexts: ElementContext[] = []

  constructor() {
    this.dependencies = new Set()
  }

  static register(dependency: Disposable) {
    const currentContext = ElementContext.activeContexts[0]

    currentContext?.dependencies.add(dependency)
  }

  execute(action: () => void) {
    ElementContext.activeContexts.unshift(this)

    try {
      action()
    } finally {
      const context = ElementContext.activeContexts.shift()

      if (context !== this) {
        throw new SyncError()
      }
    }
  }

  dispose() {
    this.dependencies.forEach(dependency => {
      dependency.dispose()
    })
  }
}
