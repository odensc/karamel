import React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";
import classnames from "classnames";

import { save } from "common/reddit-api";

import style from "./Footer.scss";

@translate("footer")
export class Footer extends React.Component<FooterProps, FooterState> {
	state: FooterState = {
		saved: false
	};

	onClickSave = async () => {
		const { id, modhash } = this.props;

		await save(modhash, id, this.state.saved).toPromise();
		this.setState({ saved: !this.state.saved });
	}

	componentDidMount() {
		this.setState({ saved: this.props.saved });
	}

	render() {
		const t = this.props.t!;
		const { children, className, modhash, permalink } = this.props;

		return (
			<ul className={classnames(style.footer, className)}>
				<li>
					<a target="_blank" href={permalink}>
						{t("permalink")}
					</a>
				</li>

				{modhash && (
					<li>
						<button onClick={this.onClickSave}>
							{t(this.state.saved ? "unsave" : "save")}
						</button>
					</li>
				)}

				{React.Children.map(children, child => (
					<li>
						{child}
					</li>
				))}
			</ul>
		);
	}
}

export interface FooterProps extends InjectedTranslateProps, React.HTMLProps<HTMLUListElement> {
	id: string;
	modhash: string;
	permalink: string;
	saved: boolean;
}

interface FooterState {
	saved: boolean;
}
