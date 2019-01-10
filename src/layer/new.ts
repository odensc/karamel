import { CompatLayer } from "./";

export default class NewLayer implements CompatLayer {
	getWatchQuery() {
		return "#main";
	}

	getCommentsContainerQuery() {
		return "#comments";
	}

	getVideoDescriptionQuery() {
		return "#description";
	}
}
