import React from "react";
import { translate } from "react-i18next";

import { format } from "common/time";

const UPDATE_INTERVAL = 10000;

@translate("time")
export class Time extends React.PureComponent<TimeProps, {}> {
	private intervalId: any;

	componentDidMount() {
		this.intervalId = setInterval(this.forceUpdate.bind(this), UPDATE_INTERVAL);
	}

	componentWillUnmount() {
		clearInterval(this.intervalId);
	}

	render() {
		const { created } = this.props;
		const age = (Date.now() / 1000) - created;
		const date = new Date(created * 1000);

		return (
			<time title={date.toLocaleString()} dateTime={date.toISOString()}>{format(age)}</time>
		);
	}
}

interface TimeProps {
	created: number;
}
