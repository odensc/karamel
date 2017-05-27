import {ActionTypes, Action} from "./actions";
import {State} from "./model";

const initialState: State = {
	value: 0
};

export default function(state = initialState, action: Action): State {
	switch (action.type) {
		case ActionTypes.INCREASE: {
			return {value: state.value + action.payload.value};
		}

		case ActionTypes.DECREASE: {
			return {value: state.value - action.payload.value};
		}

		case ActionTypes.SET: {
			return {value: action.payload.value};
		}

		default: return state;
	}
}

export * from "./actions";
export * from "./model";
