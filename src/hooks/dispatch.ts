export type DispatchFn = (eventName: string, data: any) => void;
export type Dispatcher = { dispatch: DispatchFn };

export function useDispatcher(ref: Node) {
	return function <T extends object = object>(eventName: string, data: T) {
		ref.dispatchEvent(
			new CustomEvent(eventName, { detail: data, bubbles: true, cancelable: true, composed: false })
		);
	};
}
