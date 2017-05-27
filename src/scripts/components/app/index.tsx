import React from "react";
import {Route} from "react-router";

import style from "./style.scss";
import Comments from "pages/comments";
import Options from "pages/options";

export default class App extends React.Component<any, any> {
	render() {
		return (
			<main className={style.container}>
				<Route exact path="/" component={Comments} />
				<Route exact path="/options" component={Options} />
			</main>
		);
	}
}
