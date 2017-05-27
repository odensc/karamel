import NewLayer from "./new";
import OldLayer from "./old";

export interface CompatLayer {
	getWatchQuery(): string;
	getMountElementQuery(): string;
	getCommentsContainerElement(): HTMLElement;
}

let layer: CompatLayer;

export function getCurrentLayer(): CompatLayer {
	if (layer) return layer;

	// Only the new version uses import links.
	if (document.querySelector("link[rel=import]")) {
		layer = new NewLayer();
	} else {
		layer = new OldLayer();
	}

	return layer;
}
