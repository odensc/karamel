import classnames from "classnames";
import { decode } from "he";
import React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";

import { formatScore } from "common/util";
import { Comment as RedditComment, Post } from "data/reddit";

import { Author } from "../Author";
import { Time } from "../Time";
import style from "./Comment.scss";
import { Footer } from "./Footer";
import { Vote } from "./Vote";

@translate(["comment", "footer"])
export class Comment extends React.Component<CommentProps, CommentState> {
	state: CommentState = {};

	static getDerivedStateFromProps(props: CommentProps, state: CommentState) {
		state = state || {};
		return {
			collapsed:
				typeof state.collapsed === "undefined"
					? props.comment.collapsed
					: state.collapsed
		};
	}

	onClickLoadMore = () => {
		const { comment, post, loadMore } = this.props;
		loadMore(comment.parent_id, post.name, comment.name, comment.children!);
	};

	toggleCollapsed = () => {
		this.setState({ collapsed: !this.state.collapsed });
	};

	render(): JSX.Element | null {
		const t = this.props.t!;
		const {
			comment,
			commentsLoading,
			loadMore,
			modhash,
			moreCommentsLoading,
			post
		} = this.props;
		const { collapsed } = this.state;
		const htmlBody = { __html: "" };
		if (comment.body_html) {
			htmlBody.__html = decode(comment.body_html).replace(
				/href="\/((u|r)\/([^"])+)"/g,
				`href="https://reddit.com/$1"`
			);
		}

		return comment.count === undefined ? (
			<div
				className={classnames(style.comment, {
					[style.collapsed]: this.state.collapsed,
					[style.deleted]:
						comment.body === "[deleted]" ||
						comment.body === "[removed]" ||
						post.archived
				})}
			>
				{!comment.archived && modhash && (
					<Vote
						className={style.vote}
						linkId={post.name}
						id={comment.name}
						likes={comment.likes}
						modhash={post.archived ? "" : modhash}
						score={comment.score}
					/>
				)}

				<div className={style.content}>
					<div className={style.tagline}>
						<button
							className={style.collapse}
							onClick={this.toggleCollapsed}
						>
							[{collapsed ? "+" : "–"}]
						</button>
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
								? `[${t("score_hidden")}]`
								: t("score", {
										count: comment.score,
										score: formatScore(comment.score)
								  })}
						</p>
						&nbsp;
						<Time
							created={comment.created_utc}
							edited={comment.edited}
						/>
					</div>

					<div
						className={style.body}
						dangerouslySetInnerHTML={htmlBody}
					/>

					<Footer
						className={style.footer}
						id={comment.name}
						linkId={post.name}
						modhash={modhash}
						permalink={`https://reddit.com${post.permalink.replace(
							/\?.*/,
							""
						)}${comment.id}`}
						saved={comment.saved}
					/>

					{comment.replies && (
						<div className={style.children}>
							{comment.replies &&
								comment.replies.data.children.map(
									({ data }) => (
										<Comment
											key={data.id}
											comment={data}
											commentsLoading={commentsLoading}
											loadMore={loadMore}
											modhash={modhash}
											moreCommentsLoading={
												moreCommentsLoading
											}
											post={post}
										/>
									)
								)}
						</div>
					)}
				</div>
			</div>
		) : (
			<button className={style.loadMore} onClick={this.onClickLoadMore}>
				{moreCommentsLoading.includes(comment.name) ? (
					<span className={style.loading}>
						{t("loadMore_loading")}
					</span>
				) : (
					<span>
						{t("loadMore")}{" "}
						<span className={style.count}>
							({t("loadMore_count", { count: comment.count })})
						</span>
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
	loadMore(
		parentId: string,
		linkId: string,
		id: string,
		children: string[]
	): void;
}

interface CommentState {
	collapsed?: boolean;
}
