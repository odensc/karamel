import { CompatLayer } from "./";

export default class NewLayer implements CompatLayer {
	getWatchQuery() {
		return ".ytd-item-section-renderer";
	}

	getCommentsContainerQuery() {
		return "#comments";
	}

	getVideoDescriptionQuery() {
		return "#description";
	}
}
