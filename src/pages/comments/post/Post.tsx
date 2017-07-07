import React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";

import { Comment as RedditComment, Post as RedditPost } from "data/reddit";

import { Author } from "./Author";
import { Comment } from "./Comment";
import { Time } from "../Time";
import style from "./Post.scss";

const sortTypes = [
	"confidence",
	"top",
	"new",
	"controversial",
	"old",
	"random",
	"qa",
	"live"
];

@translate(["post", "time"])
export class Post extends React.Component<PostProps, PostState> {
	state = { sort: "confidence" };

	loadMore = (parentId: string, linkId: string, id: string, children: string[]) => {
		this.props.loadMore(parentId, linkId, id, children, this.state.sort);
	}

	onSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		this.setState({ sort: e.target.value });
	}

	render() {
		const t = this.props.t!;
		const { comments, commentsLoading, modhash, moreCommentsLoading, post } = this.props;

		return (
			<div className={style.post}>
				<header className={style.header}>
					<a className={style.title} href={`https://reddit.com${post.permalink}`}>{post.title}</a>
					<p>
						<Time created={post.created_utc} />
						&nbsp;{t("by")}&nbsp;
						<Author
							author={post.author}
							distinguished={post.distinguished}
							flair={post.author_flair_text}
						/>
					</p>
				</header>

				<div className={style.comments}>
					<div className={style.sort}>
						{t("sortedBy")}:
						&nbsp;
						<select onChange={this.onSortChange} value={this.state.sort}>
							{sortTypes.map(type => (
								<option key={type} value={type}>{type}</option>
							))}
						</select>
					</div>

					{(!commentsLoading || comments.length > 0) ? (
						comments.length > 0 ? (
							comments.map(comment => (
								<Comment
									key={comment.id}
									comment={comment}
									commentsLoading={commentsLoading}
									loadMore={this.loadMore}
									modhash={modhash}
									moreCommentsLoading={moreCommentsLoading}
									post={post}
								/>
							))
						) : (
							<h2 className={style.loading}>{t("noComments")}</h2>
						)
					) : (
						<h2 className={style.loading}>{t("loading")}</h2>
					)}
				</div>
			</div>
		);
	}
}

interface PostProps extends InjectedTranslateProps {
	comments: RedditComment[];
	commentsLoading: boolean;
	modhash: string;
	moreCommentsLoading: string[];
	post: RedditPost;
	loadMore(parentId: string, linkId: string, id: string, children: string[], sort: string): void;
}

interface PostState {
	sort: string;
}
