import React from "react";
import { connect } from "react-redux";
import { Action, Dispatch, bindActionCreators } from "redux";

import { returnOf } from "common/util";
import { State } from "data";
import { update } from "data/video";
import { getCurrentLayer } from "layer";

const CHECK_INTERVAL = 1000;

class VideoListener extends React.Component<
	VideoListenerProps & ReduxProps,
	{}
> {
	private descTimeoutId: any;
	private intervalId: any;

	checkLocation = () => {
		const search = new URLSearchParams(location.search);
		const id = search.get("v");
		if (this.props.id !== id) {
			clearTimeout(this.descTimeoutId);
			this.descTimeoutId = setTimeout(() => {
				this.props.update({
					description:
						document.querySelector(
							getCurrentLayer().getVideoDescriptionQuery()
						)!.textContent || ""
				});
			}, 1000);
			this.props.update({
				id
			});
		}
	};

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

export interface VideoListenerProps {}

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
	bindActionCreators(
		{
			update
		},
		dispatch
	);

const mapStateToProps = (state: State) => ({
	id: state.video.id
});

type ReduxProps = typeof StateProps & typeof DispatchProps;
const StateProps = returnOf(mapStateToProps);
const DispatchProps = returnOf(mapDispatchToProps);

const ConnectedVideoListener = connect<
	typeof StateProps,
	typeof DispatchProps,
	VideoListenerProps
>(
	mapStateToProps,
	mapDispatchToProps
)(VideoListener);
export { ConnectedVideoListener as VideoListener };
