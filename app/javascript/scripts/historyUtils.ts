import { CanvasObject } from "../Types/CanvasObjects";
import { ChangeRecord } from "../Types/History";

export function creationChangeRecord(obj: CanvasObject): ChangeRecord {
	return {
		id: obj.id,
		type: obj.type,
		oldProperties: null,
		newProperties: obj,
	};
}

export function deletionChangeRecord(obj: CanvasObject): ChangeRecord {
	return {
		id: obj.id,
		type: obj.type,
		oldProperties: obj,
		newProperties: null,
	};
}

export function modificationChangeRecord(obj: CanvasObject, newProperties: Partial<CanvasObject>): ChangeRecord {
	const oldProperties = Object.keys(newProperties).reduce((acc, key) => {
		if (key in obj) {
			(acc as unknown)[key] = (obj as unknown)[key];
		}
		return acc;
	}, {} as Partial<CanvasObject>);

	return {
		id: obj.id,
		type: obj.type,
		oldProperties: oldProperties,
		newProperties: newProperties,
	};
}
