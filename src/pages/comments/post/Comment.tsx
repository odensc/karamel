import React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";
import classnames from "classnames";
import { decode } from "he";

import { Comment as RedditComment, Post } from "data/reddit";

import { Author } from "../Author";
import { Footer } from "./Footer";
import { Time } from "../Time";
import { Vote } from "./Vote";
import style from "./Comment.scss";

@translate(["comment", "footer"])
export class Comment extends React.PureComponent<CommentProps, CommentState> {
	state: CommentState = {
		collapsed: false,
		score: 1
	};

	onClickLoadMore = () => {
		const { comment, post, loadMore } = this.props;
		loadMore(comment.parent_id, post.name, comment.name, comment.children!);
	}

	onScoreChange = (score: number) => {
		this.setState({ score });
	}

	toggleCollapsed = () => {
		this.setState({ collapsed: !this.state.collapsed });
	}

	componentDidMount() {
		const { comment } = this.props;
		this.setState({
			score: comment.score
		});
	}

	render(): JSX.Element | null {
		const t = this.props.t!;
		const { comment, commentsLoading, loadMore, modhash, moreCommentsLoading, post } = this.props;
		const { collapsed, score } = this.state;
		const htmlBody = { __html: "" };
		if (comment.body_html) htmlBody.__html = decode(comment.body_html);

		return comment.count === undefined ? (
			<div
				className={classnames(style.comment, {
					[style.collapsed]: this.state.collapsed
				})}
			>
				{modhash && (
					<Vote
						id={comment.name}
						likes={comment.likes}
						modhash={modhash}
						onScoreChange={this.onScoreChange}
						score={comment.score}
					/>
				)}

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
								: t("score", { count: score })}
						</p>
						&nbsp;
						<Time created={comment.created_utc} />
					</div>

					<div className={style.body} dangerouslySetInnerHTML={htmlBody} />

					<Footer
						id={comment.name}
						linkId={post.name}
						modhash={modhash}
						permalink={`https://reddit.com${post.permalink.replace(/\?.*/, "")}${comment.id}`}
						saved={comment.saved}
					/>

					{comment.replies && (
						<div className={style.children}>
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
	score: number;
}
