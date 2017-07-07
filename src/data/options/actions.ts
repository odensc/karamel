import { TypedAction } from "data";
import { State } from "./model";

export enum ActionTypes {
	REQUEST = "options/REQUEST",
	SYNCED = "options/SYNCED",
	UPDATE = "options/UPDATE"
}

interface RequestAction extends TypedAction<ActionTypes.REQUEST> { }

interface SyncedAction extends TypedAction<ActionTypes.SYNCED> { }

interface UpdateAction extends TypedAction<ActionTypes.UPDATE> {
	payload: Partial<State>;
}

export type Action =
	| RequestAction
	| UpdateAction;

export const request = (): RequestAction => ({
	type: ActionTypes.REQUEST
});

export const synced = (): SyncedAction => ({
	type: ActionTypes.SYNCED
});

export const update = (delta: Partial<State>): UpdateAction => ({
	type: ActionTypes.UPDATE,
	payload: delta
});
