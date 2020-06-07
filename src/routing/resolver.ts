export type ResolverType = { new (...args: any[]): Resolver };

export type ResolverFn<T extends object = object> = (params: T) => Promise<object | void>;

export type PossibleResolver = Resolver | ResolverType | ResolverFn;

export abstract class Resolver {
	abstract resolve(params: object): Promise<object | void>;
}
