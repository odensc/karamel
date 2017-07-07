import NewLayer from "./new";
import OldLayer from "./old";

export interface CompatLayer {
	getWatchQuery(): string;
	getMountElementQuery(): string;
	getCommentsContainerQuery(): string;
	getVideoDescriptionQuery(): string;
}

let layer: CompatLayer;

export function getCurrentLayer(): CompatLayer {
	if (layer) return layer;

	// Only the new version uses import links.
	// This is the most reliable method I could find to detect versions.
	if (document.querySelector("link[rel=import]")) {
		layer = new NewLayer();
	} else {
		layer = new OldLayer();
	}

	return layer;
}
