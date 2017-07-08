import React from "react";
import classnames from "classnames";

import { vote } from "common/reddit-api";

import style from "./Vote.scss";

export class Vote extends React.PureComponent<VoteProps, VoteState> {
	state: VoteState = {
		likes: null,
		score: 1
	};

	getTrueScore() {
		const originalLikes = this.props.likes;
		const originalScore = this.props.score;
		return originalScore - (originalLikes === true ? 1 : (originalLikes === false ? -1 : 0));
	}

	onScoreChange = (score: number) => {
		this.setState({ score });
		if (this.props.onScoreChange) this.props.onScoreChange(score);
	}

	vote = async (dir: number) => {
		const { id, modhash, score } = this.props;
		const { likes } = this.state;
		const trueScore = this.getTrueScore();
		let newScore = 0;

		if ((dir === -1 && likes === false) || (dir === 1 && likes === true)) dir = 0;

		if (dir === -1) {
			this.setState({ likes: false });
			newScore = trueScore - 1;
		} else if (dir === 1) {
			this.setState({ likes: true });
			newScore = trueScore + 1;
		} else if (dir === 0) {
			this.setState({ likes: null });
			newScore = trueScore;
		}

		this.onScoreChange(newScore);

		try {
			await vote(modhash, id, dir).toPromise();
		} catch (err) {
			// If there was an error voting, set back to previous like state.
			this.setState({ likes });
			this.onScoreChange(score);
		}
	}

	voteDown = () => this.vote(-1);

	voteUp = () => this.vote(1);

	componentDidMount() {
		const { likes, score } = this.props;
		this.setState({
			likes,
			score
		});
	}

	render(): JSX.Element | null {
		const { showScore } = this.props;
		const { likes, score } = this.state;

		return (
			<div
				className={classnames(style.vote, {
					[style.downActive]: likes === false,
					[style.upActive]: likes === true
				})}
			>
				<button
					className={style.up}
					onClick={this.voteUp}
				/>

				{showScore && (
					<span className={style.score}>{score}</span>
				)}

				<button
					className={style.down}
					onClick={this.voteDown}
				/>
			</div>
		);
	}
}

export interface VoteProps {
	id: string;
	likes: boolean | null;
	modhash: string;
	score: number;
	showScore?: boolean;
	onScoreChange?(score: number): void;
}

interface VoteState {
	likes: boolean | null;
	score: number;
}
