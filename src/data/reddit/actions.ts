import { TypedAction } from "data";
import { Comment, Post } from "./";

export enum ActionTypes {
	RECEIVE_COMMENTS = "reddit/RECEIVE_COMMENTS",
	REQUEST_COMMENTS = "reddit/REQUEST_COMMENTS",
	RECEIVE_MORE_COMMENTS = "reddit/RECEIVE_MORE_COMMENTS",
	REQUEST_MORE_COMMENTS = "reddit/REQUEST_MORE_COMMENTS",
	RECEIVE_POSTS = "reddit/RECEIVE_POSTS",
	REQUEST_POSTS = "reddit/REQUEST_POSTS"
}

interface ReceiveCommentsAction extends TypedAction<ActionTypes.RECEIVE_COMMENTS> {
	payload: {
		comments: Comment[];
		linkId: string;
	};
}

interface RequestCommentsAction extends TypedAction<ActionTypes.REQUEST_COMMENTS> {
	payload: {
		linkId: string;
	};
}

interface ReceiveMoreCommentsAction extends TypedAction<ActionTypes.RECEIVE_MORE_COMMENTS> {
	payload: {
		comments: Comment[];
		id: string;
		linkId: string;
		parentId: string;
	};
}

interface RequestMoreCommentsAction extends TypedAction<ActionTypes.REQUEST_MORE_COMMENTS> {
	payload: {
		children: string[];
		id: string;
		linkId: string;
		parentId: string;
		sort: string;
	};
}

interface ReceivePostsAction extends TypedAction<ActionTypes.RECEIVE_POSTS> {
	payload: {
		modhash: string;
		posts: Post[];
	};
}

interface RequestPostsAction extends TypedAction<ActionTypes.REQUEST_POSTS> {
	payload: {
		sort: string;
		videoId: string;
	};
}

export type Action =
	| ReceiveCommentsAction
	| RequestCommentsAction
	| ReceiveMoreCommentsAction
	| RequestMoreCommentsAction
	| ReceivePostsAction
	| RequestPostsAction;

export const receiveComments = (comments: Comment[], linkId: string): ReceiveCommentsAction => ({
	type: ActionTypes.RECEIVE_COMMENTS,
	payload: { comments, linkId }
});

export const requestComments = (linkId: string): RequestCommentsAction => ({
	type: ActionTypes.REQUEST_COMMENTS,
	payload: { linkId }
});

export const receiveMoreComments = (payload: ReceiveMoreCommentsAction["payload"]): ReceiveMoreCommentsAction => ({
	type: ActionTypes.RECEIVE_MORE_COMMENTS,
	payload
});

export const requestMoreComments = (payload: RequestMoreCommentsAction["payload"]): RequestMoreCommentsAction => ({
	type: ActionTypes.REQUEST_MORE_COMMENTS,
	payload
});

export const receivePosts = (modhash: string, posts: Post[]): ReceivePostsAction => ({
	type: ActionTypes.RECEIVE_POSTS,
	payload: { modhash, posts }
});

export const requestPosts = (payload: RequestPostsAction["payload"]): RequestPostsAction => ({
	type: ActionTypes.REQUEST_POSTS,
	payload
});
