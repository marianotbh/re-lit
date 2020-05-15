import { CleanViewModel, Params } from "../components";

export type DispatchFn = (eventName: string, data: any) => void;
export type Dispatcher = { dispatch: DispatchFn };

export const createDispatcher = (node: Node) => (eventName: string, data: any) => {
	node.dispatchEvent(
		new CustomEvent(eventName, { detail: data, bubbles: true, cancelable: true, composed: false })
	);
};

export function useDispatcher<TParams extends object = object>(
	viewModel: CleanViewModel<TParams & Dispatcher>
): CleanViewModel<TParams & Dispatcher> {
	return function (params: Params<TParams & Dispatcher>) {
		const dispatch = createDispatcher(params.ref);
		return viewModel({ ...params, dispatch });
	};
}
