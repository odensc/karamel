import React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";
import { RouteComponentProps } from "react-router";

import style from "./Options.scss";

@translate("options")
export class Options extends React.Component<OptionsProps, {}> {
	render() {
		const t = this.props.t!;

		return (
			<section className={style.container}>
				<h1>{t("title")}</h1>
			</section>
		);
	}
}

export type OptionsProps = InjectedTranslateProps & RouteComponentProps<{}>;
