import {TypedAction} from "data";

export namespace ActionTypes {
	export const INCREASE = "counter/INCREASE";
	export const DECREASE = "counter/DECREASE";
	export const SET = "counter/SET";
}

interface CounterAction<T extends string> extends TypedAction<T> {
	payload: {
		value: number;
	};
}

export type Action =
	| CounterAction<typeof ActionTypes.INCREASE>
	| CounterAction<typeof ActionTypes.DECREASE>
	| CounterAction<typeof ActionTypes.SET>;

export function increase(value: number) {
	return {
		type: ActionTypes.INCREASE,
		payload: {value}
	};
}

export function decrease(value: number) {
	return {
		type: ActionTypes.DECREASE,
		payload: {value}
	};
}

export function set(value: number) {
	return {
		type: ActionTypes.SET,
		payload: {value}
	};
}
