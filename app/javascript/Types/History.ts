import { CanvasObject, CanvasObjectType } from "./CanvasObjects";

export type ChangeType = CanvasObjectType | "assignID";

export type ChangeRecord = {
	id: number;
	type: ChangeType;
	oldProperties: Partial<CanvasObject>;
	newProperties: Partial<CanvasObject>;
};

export type HistoryRecord = ChangeRecord[];
