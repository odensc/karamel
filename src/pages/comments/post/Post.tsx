import React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";
import { decode } from "he";

import { Comment as RedditComment, Post as RedditPost } from "data/reddit";

import { Author } from "../Author";
import { Comment } from "./Comment";
import { Footer } from "./Footer";
import { Loading } from "components/loading";
import { Time } from "../Time";
import { Vote } from "./Vote";
import style from "./Post.scss";

@translate("post")
export class Post extends React.PureComponent<PostProps, {}> {
	loadMore = (parentId: string, linkId: string, id: string, children: string[]) => {
		this.props.loadMore(parentId, linkId, id, children, this.props.sort);
	}

	render() {
		const t = this.props.t!;
		const { comments, commentsLoading, modhash, moreCommentsLoading, onSortChange, post, sort } = this.props;

		const sortTypes = {
			best: t("sort.best"),
			top: t("sort.top"),
			new: t("sort.new"),
			controversial: t("sort.controversial"),
			old: t("sort.old"),
			random: t("sort.random"),
			qa: t("sort.qa"),
			live: t("sort.live")
		};

		return (
			<div className={style.post}>
				<header className={style.header}>
					{modhash && (
						<Vote
							id={post.name}
							likes={post.likes}
							modhash={modhash}
							score={post.score}
							showScore
						/>
					)}

					<div className={style.headerContent}>
						<a className={style.title} href={`https://reddit.com${post.permalink}`}>{decode(post.title)}</a>

						<p>
							<Time created={post.created_utc} />
							&nbsp;{t("by")}&nbsp;
							<Author
								author={post.author}
								distinguished={post.distinguished}
								flair={post.author_flair_text}
							/>
						</p>

						<Footer
							className={style.footer}
							id={post.name}
							linkId={post.name}
							modhash={modhash}
							permalink={`https://reddit.com${post.permalink}`}
							saved={post.saved}
						/>
					</div>
				</header>

				<div className={style.comments}>
					<div className={style.sort}>
						{t("sortedBy")}:
						&nbsp;
						<select onChange={onSortChange} value={sort}>
							{Object.entries(sortTypes).map(([type, name]) => (
								<option key={type} value={type}>{name}</option>
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
						<Loading />
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
	sort: string;
	loadMore(parentId: string, linkId: string, id: string, children: string[], sort: string): void;
	onSortChange(e: React.ChangeEvent<HTMLSelectElement>): void;
}
