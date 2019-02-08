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
	onChange = (key: string, e: React.ChangeEvent<HTMLSelectElement>) => {
		this.props.update({ [key]: e.target.value });
	};

	render() {
		const t = this.props.t!;
		const { options } = this.props;
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
				<p>
					{t("default")}:{" "}
					<select
						onChange={this.onChange.bind(null, "default")}
						value={options.default}
					>
						<option value="reddit">Reddit</option>
						<option value="youtube">YouTube</option>
					</select>
				</p>
				<p>
					{t("commentSort")}:{" "}
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
					{t("postSort")}:{" "}
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
