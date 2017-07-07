import React from "react";
import { translate } from "react-i18next";

import { format } from "common/time";

export const Time = translate("time")((props: TimeProps) => {
	const { created } = props;
	const age = (Date.now() / 1000) - created;
	const date = new Date(created * 1000);

	return (
		<time title={date.toLocaleString()} dateTime={date.toISOString()}>{format(age)}</time>
	);
});

interface TimeProps {
	created: number;
}
