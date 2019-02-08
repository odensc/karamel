import NewLayer from "./new";
import OldLayer from "./old";

export interface CompatLayer {
	getWatchQuery(): string;
	getCommentsContainerQuery(): string;
	getVideoDescriptionQuery(): string;
}

let layer: CompatLayer;

export function getCurrentLayer(): CompatLayer {
	if (layer) return layer;

	// Only the new version uses custom elements.
	// This is the most reliable method I could find to detect versions.
	if (document.querySelector("ytd-app")) {
		layer = new NewLayer();
	} else {
		layer = new OldLayer();
	}

	return layer;
}
