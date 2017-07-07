import React from "react";
import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import { push } from "connected-react-router";

import { returnOf } from "common/util";
import { State } from "data";
import { getCurrentLayer } from "layer";

import redditLogo from "assets/reddit.svg";
import youtubeLogo from "assets/youtube.svg";
import style from "./ToggleButton.scss";

const layer = getCurrentLayer();

class ToggleButton extends React.Component<ToggleButtonProps, {}> {
	onButtonClick = () => {
		const nextPath = this.props.path === "/youtube" ? "/" : "/youtube";
		this.props.push(nextPath);
	}

	onMouseDown = (e: React.MouseEvent<any>) => {
		// Clear focus only on mouse interaction.
		e.preventDefault();
	}

	updateCommentDisplay(path: string) {
		const comments = document.querySelector(layer.getCommentsContainerQuery()) as HTMLElement;
		// Use opacity to hide comments, this prevents rendering artifacts.
		if (path === "/youtube") {
			comments.style.pointerEvents = "auto";
			comments.style.opacity = "1";
		} else {
			comments.style.pointerEvents = "none";
			comments.style.opacity = "0";
		}
	}

	componentWillReceiveProps(nextProps: ToggleButtonProps) {
		this.updateCommentDisplay(nextProps.path);
	}

	render() {
		const { path } = this.props;

		return (
			<button
				className={style.button}
				onMouseDown={this.onMouseDown}
				onClick={this.onButtonClick}
			>
				<img src={path === "/youtube" ? redditLogo : youtubeLogo} />
			</button>
		);
	}
}

const mapStateToProps = (state: State) => ({
	path: state.router.location.pathname
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
	push: (path: string) => dispatch(push(path))
});

export type ToggleButtonProps = typeof StateProps & typeof DispatchProps;
const StateProps = returnOf(mapStateToProps);
const DispatchProps = returnOf(mapDispatchToProps);

const ConnectedToggleButton = connect<typeof StateProps, typeof DispatchProps, {}>(
	mapStateToProps,
	mapDispatchToProps
)(ToggleButton);
export { ConnectedToggleButton as ToggleButton };
