import { combineReducers } from "redux";
import { combineEpics } from "redux-observable";
import { RouterState } from "connected-react-router";

import * as reddit from "./reddit";
import * as options from "./options";
import * as video from "./video";

export interface State {
	reddit: reddit.State;
	router: RouterState;
	options: options.State;
	video: video.State;
}

export interface TypedAction<T extends string> {
	readonly type: T;
	payload?: {};
}

export const rootEpic = combineEpics<TypedAction<any>, State>(
	reddit.epic,
	options.epic,
	video.epic
);

// TODO: remove "as any"
export default combineReducers<State>({
	reddit: reddit.reducer,
	options: options.reducer,
	video: video.reducer
} as any);
