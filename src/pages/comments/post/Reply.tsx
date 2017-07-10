import React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";

import { connect } from "react-redux";
import { Action, Dispatch, bindActionCreators } from "redux";

import { comment } from "common/reddit-api";
import { returnOf } from "common/util";
import { receiveMoreComments } from "data/reddit";

import { ActionList } from "../ActionList";
import style from "./Reply.scss";

@translate("reply")
class Reply extends React.Component<ReplyProps, ReplyState> {
	state = {
		error: "",
		loading: false,
		text: ""
	};

	onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		this.setState({ text: e.target.value });
	}

	onClickSave = async () => {
		const { modhash, onClose, linkId, parentId, t } = this.props;
		let error = "";
		this.setState({ error, loading: true });

		try {
			const data = await comment(modhash, parentId, this.state.text).toPromise();
			this.props.receiveMoreComments({
				comments: [data],
				id: "",
				linkId,
				parentId,
				prepend: true
			});
		} catch (err) {
			error = typeof err === "string" ? err : t!("unknownError");
		}

		this.setState({ error, loading: false });
		if (!error) onClose();
	}

	render() {
		const t = this.props.t!;

		return (
			<div className={style.reply}>
				<textarea onChange={this.onChange} value={this.state.text} />

				<ActionList>
					<button onClick={this.onClickSave}>{t("save")}</button>
					<button onClick={this.props.onClose}>{t("cancel")}</button>
					{this.state.error ? <p className={style.error}>{this.state.error}</p> : null}
					{this.state.loading ? <p>{t("submitting")}</p> : null}
				</ActionList>
			</div>
		);
	}
}

interface OwnProps {
	modhash: string;
	onClose: () => void;
	linkId: string;
	parentId: string;
}

interface ReplyState {
	error: string;
	loading: boolean;
	text: string;
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => bindActionCreators({
	receiveMoreComments
}, dispatch);

export type ReplyProps = typeof DispatchProps & OwnProps & InjectedTranslateProps;
const DispatchProps = returnOf(mapDispatchToProps);

const ConnectedReply = connect<{}, typeof DispatchProps, OwnProps>(
	null,
	mapDispatchToProps
)(Reply);
export { ConnectedReply as Reply };
