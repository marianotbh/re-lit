interface Renderable {
  render(rootNode: Node): Node
}

type RemoveCallback = (node: Node) => void
