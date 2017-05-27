import React from "react";
import {Link, RouteComponentProps} from "react-router-dom";
import {translate, InjectedTranslateProps} from "react-i18next";

import style from "./style.scss";

@translate("home")
export default class Home extends React.Component<Props, any> {
	render() {
		const t = this.props.t!;

		return (
			<section className={style.container}>
				<h1>{t("title")}</h1>
				<div>
					<Link to="/counter">{t("navigation.counter")}</Link>
				</div>
			</section>
		);
	}
}

type Props = InjectedTranslateProps & RouteComponentProps<{}>;
