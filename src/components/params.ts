export type ComponentInfo = { slot: DocumentFragment | null; ref: HTMLElement };

export type Params<T = {}> = T & ComponentInfo;
