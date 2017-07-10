import React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";

import { save } from "common/reddit-api";

import { ActionList } from "../ActionList";
import { Reply } from "./Reply";

@translate("footer")
export class Footer extends React.Component<FooterProps, FooterState> {
	state: FooterState = {
		replyOpen: false,
		saved: false
	};

	onClickSave = async () => {
		const { id, modhash } = this.props;

		await save(modhash, id, this.state.saved).toPromise();
		this.setState({ saved: !this.state.saved });
	}

	toggleReply = () => {
		this.setState({ replyOpen: !this.state.replyOpen });
	}

	componentDidMount() {
		this.setState({ saved: this.props.saved });
	}

	render() {
		const t = this.props.t!;
		const { className, id, linkId, modhash, permalink } = this.props;

		return (
			<div className={className}>
				<ActionList>
					<a target="_blank" href={permalink}>
						{t("permalink")}
					</a>

					{modhash && (
						<button onClick={this.onClickSave}>
							{t(this.state.saved ? "unsave" : "save")}
						</button>
					)}

					{modhash && (
						<button onClick={this.toggleReply}>
							{t("reply")}
						</button>
					)}
				</ActionList>

				{this.state.replyOpen ? (
					<Reply
						modhash={modhash}
						onClose={this.toggleReply}
						linkId={linkId}
						parentId={id}
					/>
				) : null}
			</div>
		);
	}
}

export interface FooterProps extends InjectedTranslateProps, React.HTMLProps<HTMLUListElement> {
	id: string;
	linkId: string;
	modhash: string;
	permalink: string;
	saved: boolean;
}

interface FooterState {
	replyOpen: boolean;
	saved: boolean;
}
