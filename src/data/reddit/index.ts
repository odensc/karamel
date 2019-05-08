import {
	getMe,
	getMoreChildren,
	getPost,
	search,
	vote
} from "common/reddit-api";
import { Epic, ofType } from "redux-observable";

import { State as GlobalState } from "data";
import { map, mergeMap } from "rxjs/operators";
import {
	Action,
	ActionTypes,
	receiveComments,
	receiveMe,
	receiveMoreComments,
	receivePosts,
	receiveVote
} from "./actions";
import { Comment, State } from "./model";

const initialState: State = {
	comments: {},
	commentsLoading: false,
	moreCommentsLoading: [],
	posts: [],
	postsLoading: false
};

const findId = (
	comments: Comment[],
	id: string,
	currentChildren?: { data: Comment }[]
): Comment | undefined => {
	if (!currentChildren) currentChildren = comments.map(c => ({ data: c }));

	const found = currentChildren.find(c => c && c.data && c.data.name === id);
	if (found) {
		return found.data;
	} else {
		for (const child of currentChildren) {
			if (
				child &&
				child.data &&
				child.data.replies &&
				Array.isArray(child.data.replies.data.children)
			) {
				const maybeComment = findId(
					comments,
					id,
					child.data.replies.data.children
				);
				if (maybeComment) {
					return maybeComment;
				}
			}
		}
	}
};

export const reducer = (state = initialState, action: Action): State => {
	switch (action.type) {
		case ActionTypes.REQUEST_COMMENTS: {
			return Object.assign({}, state, { commentsLoading: true });
		}

		case ActionTypes.REQUEST_MORE_COMMENTS: {
			return Object.assign({}, state, {
				moreCommentsLoading: state.moreCommentsLoading.concat(
					action.payload.id
				)
			});
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

		case ActionTypes.RECEIVE_ME: {
			return Object.assign({}, state, { me: action.payload.me });
		}

		case ActionTypes.RECEIVE_MORE_COMMENTS: {
			// TODO garbage code, probably has immutability issues
			let comments: Comment[] =
				state.comments[action.payload.linkId] || [];
			const parent = findId(comments, action.payload.parentId);
			if (!parent) {
				delete comments[
					comments.findIndex(c => c && c.name === action.payload.id)
				];

				if (!action.payload.prepend)
					comments = comments.concat(action.payload.comments);
				else comments = action.payload.comments.concat(comments);
			} else {
				if (!parent.replies)
					parent.replies = { data: { children: [] } };

				let children = parent.replies.data.children;
				delete children[
					children.findIndex(
						({ data }) => data.name === action.payload.id
					)
				];

				const addedChildren = action.payload.comments.map(c => ({
					data: c
				}));
				if (!action.payload.prepend)
					children = children.concat(addedChildren);
				else children = addedChildren.concat(children);

				parent.replies.data.children = children;
			}

			return Object.assign({}, state, {
				comments: {
					...state.comments,
					[action.payload.linkId]: comments
				},
				moreCommentsLoading: state.moreCommentsLoading.filter(
					id => id !== action.payload.id
				)
			});
		}

		case ActionTypes.RECEIVE_POSTS: {
			return Object.assign({}, state, {
				posts: action.payload.posts,
				postsLoading: false
			});
		}

		case ActionTypes.RECEIVE_VOTE: {
			const comments: Comment[] | undefined =
				state.comments[action.payload.linkId];
			const thing = comments
				? findId(comments, action.payload.id)
				: state.posts.find(p => p.name === action.payload.id);
			const trueScore =
				thing!.score -
				(thing!.likes === true ? 1 : thing!.likes === false ? -1 : 0);
			if (action.payload.dir === -1) {
				thing!.likes = false;
				thing!.score = trueScore - 1;
			} else if (action.payload.dir === 1) {
				thing!.likes = true;
				thing!.score = trueScore + 1;
			} else if (action.payload.dir === 0) {
				thing!.likes = null;
				thing!.score = trueScore;
			}

			if (!action.payload.linkId) {
				return Object.assign({}, state, {
					posts: state.posts.slice(0)
				});
			} else {
				return Object.assign({}, state, {
					comments: {
						...state.comments,
						[action.payload.linkId]:
							comments || state.comments[action.payload.linkId]
					}
				});
			}
		}

		default:
			return state;
	}
};

export const epic: Epic<Action, any, GlobalState> = (action$, state$) =>
	action$.pipe(
		ofType(
			ActionTypes.REQUEST_COMMENTS,
			ActionTypes.REQUEST_ME,
			ActionTypes.REQUEST_MORE_COMMENTS,
			ActionTypes.REQUEST_POSTS,
			ActionTypes.REQUEST_VOTE
		),
		mergeMap(action => {
			switch (action.type) {
				case ActionTypes.REQUEST_COMMENTS: {
					return getPost(
						action.payload.linkId.replace("t3_", ""),
						action.payload.sort
					).pipe(
						map(res =>
							res[1].data.children.map((c: any) => c.data)
						),
						map(comments =>
							receiveComments(comments, action.payload.linkId)
						)
					);
				}

				case ActionTypes.REQUEST_ME: {
					return getMe().pipe(map(me => receiveMe(me)));
				}

				case ActionTypes.REQUEST_MORE_COMMENTS: {
					const { linkId, id, children, sort } = action.payload;
					return getMoreChildren(
						linkId,
						id.replace("t1_", ""),
						children,
						sort
					).pipe(
						map(comments =>
							receiveMoreComments({
								comments,
								id: action.payload.id,
								linkId: action.payload.linkId,
								parentId: action.payload.parentId
							})
						)
					);
				}

				case ActionTypes.REQUEST_POSTS: {
					return search({
						q: `url:'${action.payload.videoId}'`,
						sort: action.payload.sort,
						type: "link"
					}).pipe(map(posts => receivePosts(posts)));
				}

				case ActionTypes.REQUEST_VOTE: {
					const { dir, id, linkId } = action.payload;
					return vote(state$.value.reddit.me!.modhash, id, dir).pipe(
						map(() => receiveVote({ dir, id, linkId }))
					);
				}

				default:
					return [];
			}
		})
	);

export * from "./actions";
export * from "./model";
