import { connectRouter, routerMiddleware } from "connected-react-router";
import reducers, { State, rootEpic } from "data";
import { History } from "history";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { createEpicMiddleware } from "redux-observable";

export default (history: History, initialState?: State) => {
	const epicMiddleware = createEpicMiddleware();

	const optional: any[] = [];
	if (process.env.NODE_ENV === "development") {
		const { logger } = require("redux-logger");

		optional.push(logger);
	}

	const enhancers = compose(
		applyMiddleware(...optional, routerMiddleware(history), epicMiddleware)
	);

	const store = initialState
		? createStore<State, any, any, any>(
				combineReducers({
					...reducers,
					router: connectRouter(history)
				}),
				initialState,
				enhancers
		  )
		: createStore<State, any, any, any>(
				combineReducers({
					...reducers,
					router: connectRouter(history)
				}),
				enhancers
		  );

	epicMiddleware.run(rootEpic);

	return store;
};
