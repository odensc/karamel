import {CompatLayer} from "./";

export default class NewLayer implements CompatLayer {
	getWatchQuery() {
		return "#simplebox";
	}

	getMountElementQuery() {
		return "#comments";
	}

	getCommentsContainerElement() {
		return document.querySelector(".ytd-comments") as HTMLElement;
	}
}
