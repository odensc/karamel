import {RouterState} from "connected-react-router";
import {combineReducers} from "redux";

import counter, {State as CounterState} from "./counter";

export interface State {
	counter: CounterState;
	router: RouterState;
}

export default combineReducers<State>({
	counter
});

export interface TypedAction<T extends string> {
	readonly type: T;
	payload: {};
}
