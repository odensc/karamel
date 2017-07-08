import { ActionsObservable } from "redux-observable";
import { Observable } from "common/rxjs";

import { Action, ActionTypes, synced, update } from "./actions";
import { State } from "./model";

const initialState: State = {
	commentSort: "best",
	default: "reddit",
	postSort: "top"
};

export const reducer = (state = initialState, action: Action): State => {
	switch (action.type) {
		case ActionTypes.UPDATE: {
			return Object.assign({}, state, action.payload);
		}

		default: return state;
	}
};

const getAsObservable = Observable.bindCallback<object, { [key: string]: any }>(chrome.storage.sync.get);
const setAsObservable = Observable.bindCallback<object, never>(chrome.storage.sync.set as any);

export const epic = (actions$: ActionsObservable<Action>) => actions$
	.ofType(ActionTypes.REQUEST, ActionTypes.UPDATE)
	.mergeMap(action => {
		switch (action.type) {
			case ActionTypes.REQUEST: {
				return getAsObservable(initialState)
					.map(res => update(res));
			}

			case ActionTypes.UPDATE: {
				return setAsObservable(action.payload)
					.map(() => synced());
			}
		}
	});

export * from "./actions";
export * from "./model";
