import { TypedAction } from "data";
import { Comment, Me, Post } from "./";

export enum ActionTypes {
	RECEIVE_COMMENTS = "reddit/RECEIVE_COMMENTS",
	REQUEST_COMMENTS = "reddit/REQUEST_COMMENTS",
	REQUEST_ME = "reddit/REQUEST_ME",
	RECEIVE_ME = "reddit/RECEIVE_ME",
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
		sort: string;
	};
}

interface ReceiveMeAction extends TypedAction<ActionTypes.RECEIVE_ME> {
	payload: {
		me?: Me;
	};
}

interface RequestMeAction extends TypedAction<ActionTypes.REQUEST_ME> { }

interface ReceiveMoreCommentsAction extends TypedAction<ActionTypes.RECEIVE_MORE_COMMENTS> {
	payload: {
		comments: Comment[];
		id: string;
		linkId: string;
		parentId: string;
		prepend?: boolean;
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
	| ReceiveMeAction
	| RequestMeAction
	| ReceiveMoreCommentsAction
	| RequestMoreCommentsAction
	| ReceivePostsAction
	| RequestPostsAction;

export const receiveComments = (comments: Comment[], linkId: string): ReceiveCommentsAction => ({
	type: ActionTypes.RECEIVE_COMMENTS,
	payload: { comments, linkId }
});

export const requestComments = (linkId: string, sort: string): RequestCommentsAction => ({
	type: ActionTypes.REQUEST_COMMENTS,
	payload: { linkId, sort }
});

export const receiveMe = (me?: Me): ReceiveMeAction => ({
	type: ActionTypes.RECEIVE_ME,
	payload: { me }
});

export const requestMe = (): RequestMeAction => ({
	type: ActionTypes.REQUEST_ME
});

export const receiveMoreComments = (payload: ReceiveMoreCommentsAction["payload"]): ReceiveMoreCommentsAction => ({
	type: ActionTypes.RECEIVE_MORE_COMMENTS,
	payload
});

export const requestMoreComments = (payload: RequestMoreCommentsAction["payload"]): RequestMoreCommentsAction => ({
	type: ActionTypes.REQUEST_MORE_COMMENTS,
	payload
});

export const receivePosts = (posts: Post[]): ReceivePostsAction => ({
	type: ActionTypes.RECEIVE_POSTS,
	payload: { posts }
});

export const requestPosts = (payload: RequestPostsAction["payload"]): RequestPostsAction => ({
	type: ActionTypes.REQUEST_POSTS,
	payload
});
