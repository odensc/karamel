import "chrome-extension-async";

export interface FetchRequest {
	method: "GET" | "POST";
	url: string;
}

export interface FetchResponse {
	error?: string;
	data: any;
}

const BASE_URL = "https://www.reddit.com";

chrome.runtime.onMessage.addListener(
	(request: FetchRequest, _, sendResponse) => {
		fetch(BASE_URL + request.url, {
			credentials: "include",
			method: request.method
		})
			.then(async res => {
				if (!res.ok) sendResponse({ error: await res.text() });
				else sendResponse({ data: await res.json() });
			})
			.catch(error => sendResponse({ error }));

		return true;
	}
);

chrome.browserAction.onClicked.addListener(() =>
	chrome.runtime.openOptionsPage()
);
