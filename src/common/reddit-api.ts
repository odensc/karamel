import { stringify } from "querystring";
import { AjaxRequest, AjaxResponse } from "rxjs";
import { Observable } from "common/rxjs";
import { Me } from "data/reddit";

const handleJsonError = (selector: <T>(response: any) => T) => (res: AjaxResponse) => {
	const error = res.response.json.errors[0];
	if (error) return Observable.throw(error[1]);
	else return [selector(res.response.json.data)];
};

const ajax = (url: string, options?: Partial<AjaxRequest>) => Observable.ajax({
	method: "GET",
	responseType: "json",
	timeout: 10000,
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
	return ajax(
		`${BASE_URL}/api/comment.json?${stringify(query)}`, {
		method: "POST"
	})
		.switchMap(handleJsonError(res => res.things[0].data));
}

export function getMe(): Observable<Me | undefined> {
	return ajax(`${BASE_URL}/api/me.json`)
		.switchMap(res => [res.response.data.modhash ? res.response.data : undefined]);
}

export function getMoreChildren(linkId: string, id: string, children: string[], sort: string) {
	const query = {
		api_type: "json",
		children: children.join(","),
		id,
		link_id: linkId,
		sort
	};
	return ajax(`${BASE_URL}/api/morechildren.json?${stringify(query)}`)
		.switchMap(handleJsonError(res => res.things.map((c: any) => c.data)));
}

export function getPost(postId: string, sort: string) {
	return ajax(`${BASE_URL}/${postId}.json?sort=${sort}`)
		.map(res => res.response);
}

export function save(modhash: string, id: string, unsave?: boolean) {
	const query = { id, uh: modhash };
	return ajax(`${BASE_URL}/api/${unsave ? "unsave" : "save"}?${stringify(query)}`, {
		method: "POST"
	});
}

export function search(query: QuerySearch) {
	return ajax(`${BASE_URL}/search.json?${stringify(query)}`)
		.map(res => res.response.data.children.map((c: any) => c.data));
}

export function vote(modhash: string, id: string, dir: number) {
	const query = {
		dir,
		id,
		rank: 2,
		uh: modhash
	};
	return ajax(
		`${BASE_URL}/api/vote.json?${stringify(query)}`, {
		method: "POST"
	});
		// .switchMap(handleJsonError(res => res.things[0].data));
}

interface QuerySearch {
	q: string;
	sort?: string;
	type?: string;
}
