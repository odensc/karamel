import React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";

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
		const { created, edited, t } = this.props;

		const age = (Date.now() / 1000) - created;
		const date = new Date(created * 1000);
		const ageEdited = (Date.now() / 1000) - (edited || 0);
		const dateEdited = new Date((edited || 0) * 1000);

		return (
			<span>
				<time title={date.toLocaleString()} dateTime={date.toISOString()}>
					{format(age)}
				</time>

				{edited && (
					<time title={dateEdited.toLocaleString()} dateTime={dateEdited.toISOString()}>
						* ({t!("edited", { time: format(ageEdited) })})
					</time>
				)}
			</span>
		);
	}
}

interface TimeProps extends InjectedTranslateProps {
	created: number;
	edited?: number | false;
}
