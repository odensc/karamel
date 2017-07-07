import { CompatLayer } from "./";

export default class OldLayer implements CompatLayer {
	getWatchQuery() {
		return "#comment-section-renderer";
	}

	getMountElementQuery() {
		return "#watch-discussion";
	}

	getCommentsContainerQuery() {
		return "#comment-section-renderer";
	}

	getVideoDescriptionQuery() {
		return "#eow-description";
	}
}
