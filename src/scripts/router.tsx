import React from "react";
import {History} from "history";
import {ConnectedRouter} from "connected-react-router";

import App from "components/app";

export default (props: RouterProps) => (
	<ConnectedRouter history={props.history}>
		<App />
	</ConnectedRouter>
);

interface RouterProps {
	history: History;
}
