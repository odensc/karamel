import { RouterState } from "connected-react-router";
import { combineEpics } from "redux-observable";

import * as options from "./options";
import * as reddit from "./reddit";
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

export const rootEpic = combineEpics(reddit.epic, options.epic, video.epic);

export default {
	reddit: reddit.reducer,
	options: options.reducer,
	video: video.reducer
};
