import { Epic, ofType } from "redux-observable";
import { mergeMap } from "rxjs/operators";

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

export const epic: Epic<Action, any, GlobalState> = (action$, state$) =>
	action$.pipe(
		ofType(ActionTypes.UPDATE),
		mergeMap(action =>
			action.payload.id
				? [
						requestPosts({
							sort: state$.value.options.postSort,
							videoId: action.payload.id
						})
				  ]
				: []
		)
	);

export * from "./actions";
export * from "./model";
