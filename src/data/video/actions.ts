import { TypedAction } from "data";
import { State } from "./model";

export enum ActionTypes {
	UPDATE = "video/UPDATE"
}

interface UpdateAction extends TypedAction<ActionTypes.UPDATE> {
	payload: Partial<State>;
}

export type Action = UpdateAction;

export const update = (delta: Partial<State>): UpdateAction => ({
	type: ActionTypes.UPDATE,
	payload: delta
});
