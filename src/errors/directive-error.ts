export class DirectiveError extends Error {
  constructor(directive: string, node: Node, message?: string) {
    super()

    this.message = `Directive ${directive} misusage on node ${node.nodeName}. ${message}`.trim()
  }
}
