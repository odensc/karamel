import React from "react";

import { Post } from "data/reddit";

export const PostItem = ({ onClick, post, ...props }: PostListProps) => (
	<button {...props} onClick={onClick}>
		{post.subreddit}
		&nbsp;
		<span>({post.num_comments.toLocaleString()})</span>
	</button>
);

export interface PostListProps extends React.HTMLProps<HTMLButtonElement> {
	onClick: React.MouseEventHandler<any>;
	post: Post;
}
