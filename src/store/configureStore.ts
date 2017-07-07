import { applyMiddleware, compose, createStore } from "redux";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createEpicMiddleware } from "redux-observable";
import { History } from "history";
import reducer, { State, rootEpic } from "data";

export default (history: History, initialState?: State) => {
	const epicMiddleware = createEpicMiddleware(rootEpic);

	const enhancers = compose(
		applyMiddleware(
			routerMiddleware(history),
			epicMiddleware
		)
	);

	const store = initialState
		? createStore<State>(connectRouter(history)(reducer), initialState, enhancers)
		: createStore<State>(connectRouter(history)(reducer), enhancers);

	return store;
};
