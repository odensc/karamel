import classnames from "classnames";
import React from "react";

import loading from "assets/loading.svg";
import style from "./Loading.scss";

export const Loading = ({ className }: React.HTMLProps<HTMLImageElement>) => (
	<div className={classnames(style.loading, className)}>
		<img src={loading} />
	</div>
);
