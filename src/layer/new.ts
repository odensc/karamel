import { CompatLayer } from "./";

export default class NewLayer implements CompatLayer {
	getWatchQuery() {
		return ".ytd-comments";
	}

	getMountElementQuery() {
		return "#comments";
	}

	getCommentsContainerQuery() {
		return ".ytd-comments";
	}

	getVideoDescriptionQuery() {
		return "#description";
	}
}
