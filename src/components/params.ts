export type ComponentInfo = { slot: DocumentFragment | null; ref: HTMLElement };

export type Params<T extends object = object> = T & ComponentInfo;
