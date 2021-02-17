type CleanUpCallback = () => void

type Ref = (node: Node) => void | CleanUpCallback
