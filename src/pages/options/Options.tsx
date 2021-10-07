import React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Action, Dispatch, bindActionCreators } from "redux";

import { returnOf } from "common/util";
import { State } from "data";
import { update } from "data/options";
import style from "./Options.scss";

@translate(["options", "post"])
class Options extends React.Component<OptionsProps, {}> {
	onChange = (
		key: string,
		e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
	) => {
		this.props.update({
			[key]: "checked" in e.target ? e.target.checked : e.target.value
		});
	};

	render() {
		const t = this.props.t!;
		const { me, options } = this.props;
		const sortTypes = {
			best: t("post:sort.best"),
			top: t("post:sort.top"),
			new: t("post:sort.new"),
			controversial: t("post:sort.controversial"),
			old: t("post:sort.old"),
			random: t("post:sort.random")
		};

		return (
			<section className={style.container}>
				{me && (
					<p>
						<b>Logged into Reddit as:</b> {me.name}
					</p>
				)}
				<p>
					<b>{t("default")}:</b>{" "}
					<select
						onChange={this.onChange.bind(null, "default")}
						value={options.default}
					>
						<option value="reddit">Reddit</option>
						<option value="youtube">YouTube</option>
					</select>
				</p>
				<p>
					<b>{t("commentSort")}:</b>{" "}
					<select
						onChange={this.onChange.bind(null, "commentSort")}
						value={options.commentSort}
					>
						{Object.entries(sortTypes).map(([type, name]) => (
							<option key={type} value={type}>
								{name}
							</option>
						))}
					</select>
				</p>
				<p>
					<b>{t("hideYoutubeComments")}:</b>{" "}
					<input
						type="checkbox"
						onChange={this.onChange.bind(
							null,
							"hideYoutubeComments"
						)}
						checked={options.hideYoutubeComments}
					/>
				</p>
				<p>
					<b>{t("hideZeroCommentPosts")}:</b>{" "}
					<input
						type="checkbox"
						onChange={this.onChange.bind(
							null,
							"hideZeroCommentPosts"
						)}
						checked={options.hideZeroCommentPosts}
					/>
				</p>
				<p>
					<b>{t("postSort")}:</b>{" "}
					<select
						onChange={this.onChange.bind(null, "postSort")}
						value={options.postSort}
					>
						{Object.entries(sortTypes).map(([type, name]) => (
							<option key={type} value={type}>
								{name}
							</option>
						))}
					</select>
				</p>
			</section>
		);
	}
}

export type OptionsProps = InjectedTranslateProps &
	RouteComponentProps<{}> &
	ReduxProps;

const mapStateToProps = (state: State) => ({
	me: state.reddit.me,
	options: state.options
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
	bindActionCreators(
		{
			update
		},
		dispatch
	);

type ReduxProps = typeof StateProps & typeof DispatchProps;
const StateProps = returnOf(mapStateToProps);
const DispatchProps = returnOf(mapDispatchToProps);

const ConnectedOptions = connect<typeof StateProps, typeof DispatchProps, {}>(
	mapStateToProps,
	mapDispatchToProps
)(Options);
export { ConnectedOptions as Options };
