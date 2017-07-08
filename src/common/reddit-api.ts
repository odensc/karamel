import { stringify } from "querystring";
import { AjaxRequest } from "rxjs";
import { Observable } from "common/rxjs";

const ajax = (url: string, options?: Partial<AjaxRequest>) => Observable.ajax({
	method: "GET",
	responseType: "json",
	url,
	withCredentials: true,
	...options
});

export const BASE_URL = "https://www.reddit.com";

export function comment(modhash: string, parentId: string, text: string) {
	const query = {
		api_type: "json",
		text,
		thing_id: parentId,
		uh: modhash
	};
	return ajax(`${BASE_URL}/api/comment.json?${stringify(query)}`, {
		method: "POST"
	});
}

export function getMoreChildren(linkId: string, id: string, children: string[], sort: string) {
	const query = {
		api_type: "json",
		children: children.join(","),
		id,
		link_id: linkId,
		sort
	};
	return ajax(`${BASE_URL}/api/morechildren.json?${stringify(query)}`);
}

export function getPost(postId: string) {
	return ajax(`${BASE_URL}/${postId}.json`);
}

export function save(modhash: string, id: string, unsave?: boolean) {
	const query = { id, uh: modhash };
	return ajax(`${BASE_URL}/api/${unsave ? "unsave" : "save"}?${stringify(query)}`, {
		method: "POST"
	});
}

export function search(query: QuerySearch) {
	return ajax(`${BASE_URL}/search.json?${stringify(query)}`);
}

interface QuerySearch {
	q: string;
	sort?: string;
	type?: string;
}
