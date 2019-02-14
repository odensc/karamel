import classNames from "classnames";
import { push } from "connected-react-router";
import React from "react";
import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

import { returnOf } from "common/util";
import { State } from "data";
import { getCurrentLayer } from "layer";

import redditLogo from "assets/reddit.svg";
import youtubeLogo from "assets/youtube.svg";
import style from "./ToggleButton.scss";

const layer = getCurrentLayer();

class ToggleButton extends React.Component<ToggleButtonProps & ReduxProps, {}> {
	onButtonClick = () => {
		if (this.props.disabled) return;

		const nextPath =
			this.props.path === "/youtube" ? "/reddit" : "/youtube";
		this.props.push(nextPath);
	};

	onMouseDown = (e: React.MouseEvent<any>) => {
		// Clear focus only on mouse interaction.
		e.preventDefault();
	};

	updateCommentDisplay(path: string) {
		const comments = document.querySelector(
			layer.getCommentsContainerQuery()
		) as HTMLElement;
		// Use opacity to hide comments, this prevents rendering artifacts.
		if (path === "/youtube") {
			comments.style.pointerEvents = "auto";
			comments.style.opacity = "1";
		} else {
			comments.style.pointerEvents = "none";
			comments.style.opacity = "0";
		}
	}

	componentWillReceiveProps(nextProps: ReduxProps) {
		this.updateCommentDisplay(nextProps.path);
	}

	render() {
		const { disabled, loading, path } = this.props;

		return (
			<button
				className={classNames(style.button, {
					[style.disabled]: disabled,
					[style.loading]: loading
				})}
				onMouseDown={this.onMouseDown}
				onClick={this.onButtonClick}
				title={disabled ? "No comments found" : ""}
			>
				<img src={path === "/youtube" ? redditLogo : youtubeLogo} />
			</button>
		);
	}
}

export interface ToggleButtonProps {
	disabled?: boolean;
	loading?: boolean;
}

const mapStateToProps = (state: State) => ({
	path: state.router.location.pathname
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
	push: (path: string) => dispatch(push(path))
});

type ReduxProps = typeof StateProps & typeof DispatchProps;
const StateProps = returnOf(mapStateToProps);
const DispatchProps = returnOf(mapDispatchToProps);

const ConnectedToggleButton = connect<
	typeof StateProps,
	typeof DispatchProps,
	ToggleButtonProps
>(
	mapStateToProps,
	mapDispatchToProps
)(ToggleButton);
export { ConnectedToggleButton as ToggleButton };
