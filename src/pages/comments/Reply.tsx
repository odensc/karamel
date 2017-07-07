import React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";

import { comment } from "common/reddit-api";

import style from "./Reply.scss";

@translate("reply")
export class Reply extends React.Component<ReplyProps, ReplyState> {
	state = {
		error: "",
		loading: false,
		text: ""
	};

	onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		this.setState({ text: e.target.value });
	}

	onClickSave = async () => {
		const { modhash, parentId } = this.props;

		this.setState({ error: "", loading: true });
		const errors = (await comment(modhash, parentId, this.state.text).toPromise()).response.json.errors;
		this.setState({ error: errors[0] ? errors[0][1] : "", loading: false });
	}

	render() {
		const t = this.props.t!;

		return (
			<div className={style.reply}>
				<textarea onChange={this.onChange} value={this.state.text} />

				<div className={style.buttons}>
					<button onClick={this.onClickSave}>{t("save")}</button>
					<button onClick={this.props.onClose}>{t("cancel")}</button>
					{this.state.error ? <p className={style.error}>{this.state.error}</p> : null}
					{this.state.loading ? <p>{t("submitting")}</p> : null}
				</div>
			</div>
		);
	}
}

export interface ReplyProps extends InjectedTranslateProps {
	modhash: string;
	onClose: () => void;
	parentId: string;
}

interface ReplyState {
	error: string;
	loading: boolean;
	text: string;
}
