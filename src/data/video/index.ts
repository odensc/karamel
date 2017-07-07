import { ActionsObservable } from "redux-observable";
import "common/rxjs";

import { requestPosts } from "../reddit";
import { Action, ActionTypes } from "./actions";
import { State } from "./model";

const initialState: State = {
	id: null,
	description: null
};

export const reducer = (state = initialState, action: Action): State => {
	switch (action.type) {
		case ActionTypes.UPDATE: {
			return Object.assign({}, state, action.payload);
		}

		default: return state;
	}
};

export const epic = (actions$: ActionsObservable<Action>) => actions$
	.ofType(ActionTypes.UPDATE)
	.map(action => requestPosts({
		// TODO options
		sort: "top",
		videoId: action.payload.id!
	}));

export * from "./actions";
export * from "./model";
