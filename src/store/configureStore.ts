import { connectRouter, routerMiddleware } from "connected-react-router";
import reducer, { State, rootEpic } from "data";
import { History } from "history";
import { applyMiddleware, compose, createStore } from "redux";
import { createEpicMiddleware } from "redux-observable";

export default (history: History, initialState?: State) => {
	const epicMiddleware = createEpicMiddleware(rootEpic);

	const optional: any[] = [];
	if (process.env.NODE_ENV === "development") {
		const { logger } = require("redux-logger");

		optional.push(logger);
	}

	const enhancers = compose(
		applyMiddleware(...optional, routerMiddleware(history), epicMiddleware)
	);

	const store = initialState
		? createStore<State>(
				connectRouter(history)(reducer),
				initialState,
				enhancers
		  )
		: createStore<State>(connectRouter(history)(reducer), enhancers);

	return store;
};
