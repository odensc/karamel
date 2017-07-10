import React from "react";

import { Post } from "data/reddit";

export const PostItem = ({ onClick, post, ...props }: PostListProps) => (
	<button {...props} onClick={onClick}>
		{post.subreddit} <span style={{color: "#888"}}>({post.num_comments})</span>
	</button>
);

export interface PostListProps extends React.HTMLProps<HTMLButtonElement> {
	onClick: React.MouseEventHandler<any>;
	post: Post;
}
