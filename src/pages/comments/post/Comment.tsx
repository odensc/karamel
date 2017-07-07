import React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";
import classnames from "classnames";
import { decode } from "he";

import { save } from "common/reddit-api";
import { Comment as RedditComment, Post } from "data/reddit";

import { Author } from "./Author";
import { Reply } from "../Reply";
import { Time } from "../Time";
import style from "./Comment.scss";

@translate("comment")
export class Comment extends React.Component<CommentProps, CommentState> {
	state = {
		collapsed: false,
		replyOpen: false,
		saved: false
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

	componentDidMount() {
		this.setState({ saved: this.props.comment.saved });
	}

	render(): JSX.Element | null {
		const t = this.props.t!;
		const { comment, commentsLoading, loadMore, modhash, moreCommentsLoading, post } = this.props;
		const { collapsed } = this.state;
		const htmlBody = { __html: "" };
		if (comment.body_html) htmlBody.__html = decode(comment.body_html);

		return !comment.count ? (
			<div
				className={classnames(style.comment, {
					[style.collapsed]: this.state.collapsed
				})}
			>
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
					<p className={style.score}>{t("score", { count: comment.score })}</p>
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

					<li>
						<button onClick={this.onClickSave}>
							{t(`footer.${this.state.saved ? "unsave" : "save"}`)}
						</button>
					</li>

					<li>
						<button onClick={this.toggleReply}>{t("footer.reply")}</button>
					</li>
				</ul>

				{this.state.replyOpen ? (
					<Reply modhash={modhash} onClose={this.toggleReply} parentId={comment.parent_id} />
				) : null}

				{comment.replies && (
					<div className={style.children}>
						{comment.replies.data.children.map(({ data }) => (
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
	replyOpen: boolean;
	saved: boolean;
}
