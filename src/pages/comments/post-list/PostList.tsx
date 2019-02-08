import classnames from "classnames";
import React from "react";

import { Post } from "data/reddit";

import { PostItem } from "./PostItem";
import style from "./PostList.scss";

export const PostList = ({
	activePostId,
	description,
	onPostClick,
	posts
}: PostListProps) => {
	const sub = (description.match(/reddit\.com\/r\/([^ /\n]+)/) || [])[1];

	return (
		<div className={style.list}>
			{posts
				.sort(post => (post.subreddit === sub ? -1 : 0))
				.map(post => (
					<PostItem
						key={post.name}
						className={classnames(style.item, {
							[style.active]: post.name === activePostId,
							[style.official]: post.subreddit === sub
						})}
						onClick={onPostClick.bind(null, post)}
						post={post}
						title={
							post.subreddit === sub ? "Official Subreddit" : ""
						}
					/>
				))}
		</div>
	);
};

export interface PostListProps {
	activePostId: string;
	description: string;
	onPostClick: (post: Post) => void;
	posts: Post[];
}
