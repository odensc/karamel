import { CompatLayer } from "./";

export default class OldLayer implements CompatLayer {
	getWatchQuery() {
		return ".watch-main-col";
	}

	getCommentsContainerQuery() {
		return "#watch-discussion";
	}

	getVideoDescriptionQuery() {
		return "#eow-description";
	}
}
