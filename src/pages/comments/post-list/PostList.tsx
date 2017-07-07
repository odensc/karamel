import React from "react";
import classnames from "classnames";

import { Post } from "data/reddit";

import { PostItem } from "./PostItem";
import style from "./PostList.scss";

export const PostList = ({ activePostId, onPostClick, posts }: PostListProps) => (
	<div className={style.list}>
		{posts.map(post => (
			<PostItem
				key={post.name}
				className={classnames(style.item, {
					[style.active]: post.name === activePostId
				})}
				onClick={onPostClick.bind(null, post)}
				post={post}
			/>
		))}
	</div>
);

export interface PostListProps {
	activePostId: string;
	onPostClick: (post: Post) => void;
	posts: Post[];
}
