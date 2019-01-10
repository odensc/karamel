import { ConnectedRouter } from "connected-react-router";
import { History } from "history";
import React from "react";

import { App } from "components/app";

export default (props: RouterProps) => (
	<ConnectedRouter history={props.history}>
		<App />
	</ConnectedRouter>
);

interface RouterProps {
	history: History;
}
