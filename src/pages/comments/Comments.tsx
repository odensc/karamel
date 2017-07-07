import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Action, Dispatch, bindActionCreators } from "redux";

import { returnOf } from "common/util";
import { State } from "data";
import { Post as RedditPost, requestComments, requestMoreComments, requestPosts } from "data/reddit";

import { Post } from "./post";
import { PostList } from "./post-list";
import style from "./Comments.scss";

class Comments extends React.Component<CommentsProps, CommentsState> {
	state: CommentsState = { };

	loadMore = (parentId: string, linkId: string, id: string, children: string[], sort: string) => {
		this.props.requestMoreComments({ parentId, linkId, id, children, sort });
	}

	onPostClick = (post: RedditPost) => {
		this.setState({ post });
		this.props.requestComments(post.name);
	}

	selectFirstPost(posts: RedditPost[]) {
		// If posts have changed, default to first post.
		if (posts.length > 0 && !posts.includes(this.state.post!)) {
			this.setState({ post: posts[0] });
			this.props.requestComments(posts[0].name);
		}
	}

	componentDidMount() {
		this.selectFirstPost(this.props.posts);
	}

	componentWillReceiveProps(nextProps: CommentsProps) {
		this.selectFirstPost(nextProps.posts);
	}

	render() {
		const { commentsLoading } = this.props;
		const { post } = this.state;

		return (
			<section className={style.container}>
				<PostList
					activePostId={post ? post.name : ""}
					onPostClick={this.onPostClick}
					posts={this.props.posts}
				/>

				{post && (
					<Post
						comments={this.props.comments[post.name] || []}
						commentsLoading={commentsLoading}
						loadMore={this.loadMore}
						modhash={this.props.modhash}
						moreCommentsLoading={this.props.moreCommentsLoading}
						post={post}
					/>
				)}
			</section>
		);
	}
}

interface CommentsState {
	post?: RedditPost;
}

const mapStateToProps = (state: State) => ({
	comments: state.reddit.comments,
	commentsLoading: state.reddit.commentsLoading,
	modhash: state.reddit.modhash,
	moreCommentsLoading: state.reddit.moreCommentsLoading,
	posts: state.reddit.posts,
	sort: state.options.sort
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => bindActionCreators({
	requestComments,
	requestMoreComments,
	requestPosts
}, dispatch);

export type CommentsProps = typeof StateProps & typeof DispatchProps & RouteComponentProps<{}>;
const StateProps = returnOf(mapStateToProps);
const DispatchProps = returnOf(mapDispatchToProps);

const ConnectedComments = connect<typeof StateProps, typeof DispatchProps, RouteComponentProps<{}>>(
	mapStateToProps,
	mapDispatchToProps
)(Comments);
export { ConnectedComments as Comments };
