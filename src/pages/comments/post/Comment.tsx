import React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";
import classnames from "classnames";
import { decode } from "he";

import { save, vote } from "common/reddit-api";
import { Comment as RedditComment, Post } from "data/reddit";

import { Author } from "../Author";
import { Reply } from "./Reply";
import { Time } from "../Time";
import style from "./Comment.scss";

@translate("comment")
export class Comment extends React.PureComponent<CommentProps, CommentState> {
	state: CommentState = {
		collapsed: false,
		likes: null,
		replyOpen: false,
		saved: false,
		score: 1
	};

	onClickLoadMore = () => {
		const { comment, post, loadMore } = this.props;
		loadMore(comment.parent_id, post.name, comment.name, comment.children!);
	}

	onClickSave = async () => {
		const { comment, modhash } = this.props;

		await save(modhash, comment.name, this.state.saved).toPromise();
		this.setState({ saved: !this.state.saved });
	}

	toggleCollapsed = () => {
		this.setState({ collapsed: !this.state.collapsed });
	}

	toggleReply = () => {
		this.setState({ replyOpen: !this.state.replyOpen });
	}

	vote = async (dir: number) => {
		const { comment, modhash } = this.props;
		const { likes, score } = this.state;
		const trueScore = comment.score - (comment.likes === true ? 1 : -1);
		if ((dir === -1 && likes === false) || (dir === 1 && likes === true)) dir = 0;

		if (dir === -1) this.setState({ likes: false, score: trueScore - 1 });
		else if (dir === 1) this.setState({ likes: true, score: trueScore + 1 });
		else if (dir === 0) this.setState({ likes: null, score: trueScore });

		try {
			await vote(modhash, comment.name, dir).toPromise();
		} catch (err) {
			// If there was an error voting, set back to previous like state.
			this.setState({ likes, score });
		}
	}

	voteDown = () => this.vote(-1);

	voteUp = () => this.vote(1);

	componentDidMount() {
		const { comment } = this.props;
		this.setState({
			likes: comment.likes,
			saved: comment.saved,
			score: comment.score
		});
	}

	render(): JSX.Element | null {
		const t = this.props.t!;
		const { comment, commentsLoading, loadMore, modhash, moreCommentsLoading, post } = this.props;
		const { collapsed, likes } = this.state;
		const htmlBody = { __html: "" };
		if (comment.body_html) htmlBody.__html = decode(comment.body_html);

		return comment.count === undefined ? (
			<div
				className={classnames(style.comment, {
					[style.collapsed]: this.state.collapsed
				})}
			>
				<div className={style.vote}>
					<button
						className={classnames(style.up, { [style.active]: likes === true })}
						onClick={this.voteUp}
					/>

					<button
						className={classnames(style.down, { [style.active]: likes === false })}
						onClick={this.voteDown}
					/>
				</div>

				<div className={style.content}>
					<div className={style.tagline}>
						<button className={style.collapse} onClick={this.toggleCollapsed}>[{collapsed ? "+" : "–"}]</button>
						&nbsp;
						<Author
							className={style.author}
							author={comment.author}
							distinguished={comment.distinguished}
							flair={comment.author_flair_text}
							submitter={comment.author === post.author}
						/>
						&nbsp;
						<p className={style.score}>
							{comment.score_hidden
								? t("score_hidden")
								: t("score", { count: this.state.score })}
						</p>
						&nbsp;
						<Time created={comment.created_utc} />
					</div>

					<div className={style.body} dangerouslySetInnerHTML={htmlBody} />

					<ul className={style.footer}>
						<li>
							<a target="_blank" href={`https://reddit.com${post.permalink.replace(/\?.*/, "")}${comment.id}`}>
								{t("footer.permalink")}
							</a>
						</li>

						{modhash && (
							<li>
								<button onClick={this.onClickSave}>
									{t(`footer.${this.state.saved ? "unsave" : "save"}`)}
								</button>
							</li>
						)}

						{modhash && (
							<li>
								<button onClick={this.toggleReply}>{t("footer.reply")}</button>
							</li>
						)}
					</ul>

					{(comment.replies || this.state.replyOpen) && (
						<div className={style.children}>
							{this.state.replyOpen ? (
								<Reply
									modhash={modhash}
									onClose={this.toggleReply}
									linkId={post.name}
									parentId={comment.name}
								/>
							) : null}

							{comment.replies && comment.replies.data.children.map(({ data }) => (
								<Comment
									key={data.id}
									comment={data}
									commentsLoading={commentsLoading}
									loadMore={loadMore}
									modhash={modhash}
									moreCommentsLoading={moreCommentsLoading}
									post={post}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		) : (
				<button
					className={style.loadMore}
					onClick={this.onClickLoadMore}
				>
					{moreCommentsLoading.includes(comment.name) ? (
						<span className={style.loading}>{t("loadMore_loading")}</span>
					) : (
							<span>
								{t("loadMore")} <span className={style.count}>({t("loadMore_count", { count: comment.count })})</span>
							</span>
						)}
				</button>
			);
	}
}

export interface CommentProps extends InjectedTranslateProps {
	comment: RedditComment;
	commentsLoading: boolean;
	modhash: string;
	moreCommentsLoading: string[];
	post: Post;
	loadMore(parentId: string, linkId: string, id: string, children: string[]): void;
}

interface CommentState {
	collapsed: boolean;
	likes: boolean | null;
	replyOpen: boolean;
	saved: boolean;
	score: number;
}
