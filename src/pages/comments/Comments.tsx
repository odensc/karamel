import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Action, Dispatch, bindActionCreators } from "redux";

import { returnOf } from "common/util";
import { State } from "data";
import {
	Post as RedditPost,
	requestComments,
	requestMoreComments,
	requestPosts
} from "data/reddit";

import { Loading } from "components/loading";
import style from "./Comments.scss";
import { Post } from "./post";
import { PostList } from "./post-list";

class Comments extends React.Component<
	CommentsProps & ReduxProps,
	CommentsState
> {
	state: CommentsState = { sort: {} };

	loadMore = (
		parentId: string,
		linkId: string,
		id: string,
		children: string[],
		sort: string
	) => {
		this.props.requestMoreComments({
			parentId,
			linkId,
			id,
			children,
			sort
		});
	};

	onPostClick = (post: RedditPost) => {
		this.setState({ post });
	};

	onSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		this.props.requestComments(this.state.post!.name, e.target.value);
		this.setState({
			sort: {
				...this.state.sort,
				[this.state.post!.name]: e.target.value
			}
		});
	};

	selectFirstPost = (posts: RedditPost[]) =>
		posts.length > 0 && this.setState({ post: posts[0] });

	componentDidUpdate(prevProps: ReduxProps, prevState: CommentsState) {
		// Select first post if it's the first load
		if (prevProps.posts.length !== this.props.posts.length) {
			this.selectFirstPost(this.props.posts);
		}

		// Request comments if post was changed
		if (
			this.state.post &&
			!this.props.comments[this.state.post.name] &&
			(!prevState.post || this.state.post.name !== prevState.post.name)
		) {
			this.props.requestComments(
				this.state.post!.name,
				this.state.sort[this.state.post!.name] || this.props.commentSort
			);
		}
	}

	render() {
		const { commentsLoading, description, postsLoading } = this.props;
		const { post } = this.state;

		return (
			<section className={style.container}>
				<PostList
					activePostId={post ? post.name : ""}
					description={description}
					onPostClick={this.onPostClick}
					posts={this.props.posts}
				/>

				{!postsLoading && post ? (
					<Post
						comments={this.props.comments[post.name] || []}
						commentsLoading={commentsLoading}
						loadMore={this.loadMore}
						modhash={this.props.modhash}
						moreCommentsLoading={this.props.moreCommentsLoading}
						onSortChange={this.onSortChange}
						post={post}
						sort={this.state.sort[post.name] || "best"}
					/>
				) : (
					<Loading />
				)}
			</section>
		);
	}
}

export interface CommentsProps extends RouteComponentProps<{}> {}

interface CommentsState {
	post?: RedditPost;
	sort: { [id: string]: string };
}

const mapStateToProps = (state: State) => ({
	comments: state.reddit.comments,
	commentSort: state.options.commentSort,
	commentsLoading: state.reddit.commentsLoading,
	description: state.video.description,
	modhash: state.reddit.me ? state.reddit.me.modhash : "",
	moreCommentsLoading: state.reddit.moreCommentsLoading,
	posts: state.reddit.posts,
	postsLoading: state.reddit.postsLoading
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
	bindActionCreators(
		{
			requestComments,
			requestMoreComments,
			requestPosts
		},
		dispatch
	);

type ReduxProps = typeof StateProps & typeof DispatchProps;
const StateProps = returnOf(mapStateToProps);
const DispatchProps = returnOf(mapDispatchToProps);

const ConnectedComments = connect<
	typeof StateProps,
	typeof DispatchProps,
	CommentsProps
>(
	mapStateToProps,
	mapDispatchToProps
)(Comments);
export { ConnectedComments as Comments };
