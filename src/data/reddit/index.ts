import { ActionsObservable } from "redux-observable";
import { getMoreChildren, getPost, search } from "common/reddit-api";
import "common/rxjs";

import { Action, ActionTypes, receiveComments, receiveMoreComments, receivePosts } from "./actions";
import { Comment, State } from "./model";

const initialState: State = {
	comments: {},
	commentsLoading: false,
	modhash: "",
	moreCommentsLoading: [],
	posts: [],
	postsLoading: false
};

const findId = (comments: Comment[], id: string, currentChildren?: { data: Comment }[]): Comment | undefined => {
	if (!currentChildren) currentChildren = comments.map(c => ({ data: c }));

	const found = currentChildren.find(c => c && c.data && c.data.name === id);
	if (found) {
		return found.data;
	} else {
		for (const child of currentChildren) {
			if (
				child
				&& child.data
				&& Array.isArray(child.data.replies)
			) {
				return findId(comments, id, child.data.replies);
			}
		}

		return;
	}
};

export const reducer = (state = initialState, action: Action): State => {
	switch (action.type) {
		case ActionTypes.REQUEST_COMMENTS: {
			return Object.assign({}, state, { commentsLoading: true });
		}

		case ActionTypes.REQUEST_MORE_COMMENTS: {
			return Object.assign({}, state, { moreCommentsLoading: state.moreCommentsLoading.concat(action.payload.id) });
		}

		case ActionTypes.REQUEST_POSTS: {
			return Object.assign({}, state, { postsLoading: true });
		}

		case ActionTypes.RECEIVE_COMMENTS: {
			return Object.assign({}, state, {
				comments: {
					...state.comments,
					[action.payload.linkId]: action.payload.comments
				},
				commentsLoading: false
			});
		}

		case ActionTypes.RECEIVE_MORE_COMMENTS: {
			// TODO immutability?
			const comments: Comment[] = state.comments[action.payload.linkId] || [];
			const parent = findId(comments, action.payload.parentId);
			if (!parent) {
				delete comments[comments.findIndex(c => c && c.name === action.payload.id)];
				comments.push(...action.payload.comments);
			} else if (parent.replies) {
				const children = parent.replies.data.children;
				delete children[children.findIndex(({ data }) => data.name === action.payload.id)];
				children.push(
					...action.payload.comments
						.map(c => ({ data: c }))
				);
			}

			return Object.assign({}, state, {
				comments: {
					...state.comments,
					[action.payload.linkId]: comments
				},
				moreCommentsLoading: state.moreCommentsLoading.filter(id => id !== action.payload.id)
			});
		}

		case ActionTypes.RECEIVE_POSTS: {
			return Object.assign({}, state, {
				modhash: action.payload.modhash,
				posts: action.payload.posts,
				postsLoading: false
			});
		}

		default: return state;
	}
};

export const epic = (actions$: ActionsObservable<Action>) => actions$
	.ofType(ActionTypes.REQUEST_COMMENTS, ActionTypes.REQUEST_MORE_COMMENTS, ActionTypes.REQUEST_POSTS)
	.switchMap(action => {
		switch (action.type) {
			case ActionTypes.REQUEST_COMMENTS: {
				return getPost(action.payload.linkId.replace("t3_", ""))
					.map(res => res.response[1].data.children.map((c: any) => c.data))
					.map(comments => receiveComments(comments, action.payload.linkId));
			}

			case ActionTypes.REQUEST_MORE_COMMENTS: {
				const { linkId, id, children, sort } = action.payload;
				return getMoreChildren(linkId, id.replace("t1_", ""), children, sort)
					.map(res => res.response.json.data.things.map((c: any) => c.data))
					.map(comments => receiveMoreComments({
						comments,
						id: action.payload.id,
						linkId: action.payload.linkId,
						parentId: action.payload.parentId
					}));
			}

			case ActionTypes.REQUEST_POSTS: {
				return search({
					q: `url:'${action.payload.videoId}'`,
					sort: action.payload.sort,
					type: "link"
				})
					.map(res => [
						res.response.data.modhash,
						res.response.data.children.map((c: any) => c.data)
					])
					.map(([modhash, posts]) => receivePosts(modhash, posts));
			}

			default: return [];
		}
	});

export * from "./actions";
export * from "./model";
