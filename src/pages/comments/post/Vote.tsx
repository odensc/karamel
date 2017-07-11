import React from "react";
import classnames from "classnames";

import { vote } from "common/reddit-api";

import style from "./Vote.scss";

// TODO: Cleanup using proper Redux state.
export class Vote extends React.PureComponent<VoteProps, VoteState> {
	state: VoteState = {};

	formatScore(score: number) {
		if (score < 10000) return score;

		const thousands = score / 1000;
		return `${thousands.toFixed(thousands < 100 ? 1 : 0)}k`;
	}

	getTrueScore() {
		const originalLikes = this.props.likes;
		const originalScore = this.props.score;
		return originalScore - (originalLikes === true ? 1 : (originalLikes === false ? -1 : 0));
	}

	onScoreChange = (likes: boolean | null, score: number) => {
		this.setState({
			[this.props.id]: {
				likes,
				score
			}
		});
		if (this.props.onScoreChange) this.props.onScoreChange(score);
	}

	vote = async (dir: number) => {
		const { id, modhash, score } = this.props;
		const { likes } = this.state[id];
		const trueScore = this.getTrueScore();
		let newLikes = null;
		let newScore = 0;

		if ((dir === -1 && likes === false) || (dir === 1 && likes === true)) dir = 0;

		if (dir === -1) {
			newLikes = false;
			newScore = trueScore - 1;
		} else if (dir === 1) {
			newLikes = true;
			newScore = trueScore + 1;
		} else if (dir === 0) {
			newLikes = null;
			newScore = trueScore;
		}

		this.onScoreChange(newLikes, newScore);

		try {
			await vote(modhash, id, dir).toPromise();
		} catch (err) {
			// If there was an error voting, set back to previous like state.
			this.onScoreChange(likes, score);
		}
	}

	voteDown = () => this.vote(-1);

	voteUp = () => this.vote(1);

	componentWillMount() {
		this.updateState(this.props);
	}

	componentWillReceiveProps(nextProps: VoteProps) {
		this.updateState(nextProps);
	}

	render(): JSX.Element | null {
		const { className, id, modhash, showScore } = this.props;
		const { likes, score } = this.state[id];

		return (
			<div
				className={classnames(style.vote, className, {
					[style.downActive]: likes === false,
					[style.noArrows]: !modhash,
					[style.upActive]: likes === true
				})}
			>
				<button
					className={style.up}
					onClick={this.voteUp}
				/>

				{showScore && (
					<span className={style.score}>{this.formatScore(score)}</span>
				)}

				<button
					className={style.down}
					onClick={this.voteDown}
				/>
			</div>
		);
	}

	private updateState(props: VoteProps) {
		const { likes, id, score } = props;
		if (this.state[id]) return;

		this.setState({
			[id]: {
				likes,
				score
			}
		});
	}
}

export interface VoteProps extends React.HTMLProps<HTMLDivElement> {
	id: string;
	likes: boolean | null;
	modhash: string;
	score: number;
	showScore?: boolean;
	onScoreChange?(score: number): void;
}

interface VoteState {
	[id: string]: {
		likes: boolean | null;
		score: number;
	};
}
