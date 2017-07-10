import React from "react";
import classnames from "classnames";

import style from "./ActionList.scss";

export const ActionList = ({ children, className }: React.HTMLProps<HTMLUListElement>) => (
	<ul className={classnames(style.list, className)}>
		{React.Children.map(children, child => (
			<li>
				{child}
			</li>
		))}
	</ul>
);
