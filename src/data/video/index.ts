import { MiddlewareAPI } from "redux";
import { ActionsObservable } from "redux-observable";

import "common/rxjs";
import { State as GlobalState } from "data";

import { requestPosts } from "../reddit";
import { Action, ActionTypes } from "./actions";
import { State } from "./model";

const initialState: State = {
	description: "",
	id: null
};

export const reducer = (state = initialState, action: Action): State => {
	switch (action.type) {
		case ActionTypes.UPDATE: {
			return Object.assign({}, state, action.payload);
		}

		default:
			return state;
	}
};

export const epic = (
	actions$: ActionsObservable<Action>,
	store: MiddlewareAPI<GlobalState>
) =>
	actions$.ofType(ActionTypes.UPDATE).mergeMap(action =>
		action.payload.id
			? [
					requestPosts({
						sort: store.getState().options.postSort,
						videoId: action.payload.id
					})
			  ]
			: []
	);

export * from "./actions";
export * from "./model";
