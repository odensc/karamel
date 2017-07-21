import React from "react";
import { connect } from "react-redux";
import { Action, Dispatch, bindActionCreators } from "redux";

import { returnOf } from "common/util";
import { State } from "data";
import { update } from "data/video";

const CHECK_INTERVAL = 1000;

class VideoListener extends React.Component<VideoListenerProps, {}> {
	private intervalId: any;

	checkLocation = () => {
		const search = new URLSearchParams(location.search);
		const id = search.get("v");
		if (this.props.id !== id) {
			this.props.update({ id });
		}
	}

	componentDidMount() {
		this.intervalId = setInterval(this.checkLocation, CHECK_INTERVAL);
		// Trigger initial video state hydration.
		this.checkLocation();
	}

	componentWillUnmount() {
		clearInterval(this.intervalId);
	}

	render() {
		return null;
	}
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => bindActionCreators({
	update
}, dispatch);

const mapStateToProps = (state: State) => ({
	id: state.video.id
});

export type VideoListenerProps = typeof StateProps & typeof DispatchProps;
const StateProps = returnOf(mapStateToProps);
const DispatchProps = returnOf(mapDispatchToProps);

const ConnectedVideoListener = connect<typeof StateProps, typeof DispatchProps, {}>(
	mapStateToProps,
	mapDispatchToProps
)(VideoListener);
export { ConnectedVideoListener as VideoListener };
