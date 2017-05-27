import {CompatLayer} from "./";

export default class OldLayer implements CompatLayer {
	getWatchQuery() {
		return "#comment-section-renderer";
	}

	getMountElementQuery() {
		return "#watch-discussion";
	}

	getCommentsContainerElement() {
		return document.querySelector("#comment-section-renderer") as HTMLElement;
	}
}
