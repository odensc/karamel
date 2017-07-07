import React from "react";
import { connect } from "react-redux";
import { Action, Dispatch, bindActionCreators } from "redux";

import { returnOf } from "common/util";
import { update } from "data/video";
import { getCurrentLayer } from "layer";

const layer = getCurrentLayer();

class VideoListener extends React.Component<VideoListenerProps, {}> {
	private description: HTMLElement;
	private observer: MutationObserver;

	onDescriptionChange = () => {
		const search = new URLSearchParams(location.search);
		const id = search.get("v");
		this.props.update({
			id,
			description: this.description.innerText
		});
	}

	componentDidMount() {
		this.description = document.querySelector(layer.getVideoDescriptionQuery()) as HTMLElement;
		this.observer = new MutationObserver(this.onDescriptionChange);
		this.observer.observe(this.description, {
			attributes: true,
			characterData: true,
			childList: true,
			subtree: true
		});

		// Trigger initial video state hydration.
		this.onDescriptionChange();
	}

	componentWillUnmount() {
		this.observer.disconnect();
	}

	render() {
		return null;
	}
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => bindActionCreators({
	update
}, dispatch);

export type VideoListenerProps = typeof DispatchProps;
const DispatchProps = returnOf(mapDispatchToProps);

const ConnectedVideoListener = connect<{}, typeof DispatchProps, {}>(
	null,
	mapDispatchToProps
)(VideoListener);
export { ConnectedVideoListener as VideoListener };
