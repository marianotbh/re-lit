import {IncompatibilityError} from '../errors/incompatibility-error'

export class RenderContext {
  private readonly removeCallbacks: Map<Node, Set<RemoveCallback>>
  private readonly observer: MutationObserver

  private static activeContexts: Set<RenderContext> = new Set()

  constructor(private readonly root: Node) {
    this.removeCallbacks = new Map()

    if (typeof globalThis.MutationObserver === 'undefined') {
      throw new IncompatibilityError(MutationObserver.name)
    }

    this.observer = new MutationObserver(async mutations => {
      mutations
        .filter(mutation => mutation.type === 'childList')
        .forEach(({removedNodes}) => {
          removedNodes.forEach(removedNode => {
            this.disposeNode(removedNode)
          })
        })
    })
  }

  static register(node: Node, callback: RemoveCallback) {
    const activeTrees = Array.from(this.activeContexts)
    const root = activeTrees.find(tree => tree.root.contains(node))

    if (root) {
      root.register(node, callback)
    }
  }

  initialize() {
    this.observer.observe(this.root, {childList: true, subtree: true})

    RenderContext.activeContexts.add(this)

    this.register(this.root, () => {
      RenderContext.activeContexts.delete(this)
      this.dispose()
    })
  }

  register(node: Node, callback: RemoveCallback) {
    let nodeCallbacks = this.removeCallbacks.get(node)

    if (!nodeCallbacks) {
      nodeCallbacks = new Set()
      this.removeCallbacks.set(node, nodeCallbacks)
    }

    nodeCallbacks.add(callback)
  }

  disposeNode(node: Node) {
    const nodeCallbacks = this.removeCallbacks.get(node)

    if (nodeCallbacks) {
      nodeCallbacks.forEach(removeCallback => {
        removeCallback(node)
      })

      this.removeCallbacks.delete(node)
    }
  }

  dispose() {
    this.observer.disconnect()
  }
}
