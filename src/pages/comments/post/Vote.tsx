import classnames from "classnames";
import React from "react";
import { connect } from "react-redux";
import { Action, Dispatch, bindActionCreators } from "redux";

import { formatScore, returnOf } from "common/util";
import { requestVote } from "data/reddit";

import style from "./Vote.scss";

class Vote extends React.PureComponent<VoteProps & ReduxProps, {}> {
	vote = async (dir: number) => {
		const { linkId, id, likes, requestVote } = this.props;

		if ((dir === -1 && likes === false) || (dir === 1 && likes === true)) {
			dir = 0;
		}

		requestVote({ dir, id, linkId });
	};

	voteDown = () => this.vote(-1);

	voteUp = () => this.vote(1);

	render() {
		const { className, likes, modhash, score, showScore } = this.props;

		return (
			<div
				className={classnames(style.vote, className, {
					[style.downActive]: likes === false,
					[style.noArrows]: !modhash,
					[style.upActive]: likes === true
				})}
			>
				<button className={style.up} onClick={this.voteUp} />

				{showScore && (
					<span className={style.score}>{formatScore(score)}</span>
				)}

				<button className={style.down} onClick={this.voteDown} />
			</div>
		);
	}
}

export interface VoteProps extends React.HTMLProps<HTMLDivElement> {
	linkId: string;
	id: string;
	likes: boolean | null;
	modhash: string;
	score: number;
	showScore?: boolean;
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
	bindActionCreators(
		{
			requestVote
		},
		dispatch
	);

type ReduxProps = typeof DispatchProps;
const DispatchProps = returnOf(mapDispatchToProps);

const ConnectedVote = connect<{}, typeof DispatchProps, VoteProps>(
	null,
	mapDispatchToProps
)(Vote);
export { ConnectedVote as Vote };
