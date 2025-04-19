import { CanvasObject, CanvasObjectType, Line, Point } from "../../Types/CanvasObjects";
import { ChangeRecord } from "../../Types/History";
import { modificationChangeRecord } from "../historyUtils";

export function moveObject(object: CanvasObject, moveBy: Point): ChangeRecord {
	let changeRecord: ChangeRecord;

	if (object.type === CanvasObjectType.Line) {
		const newPoints = object.points.map((point, i) => {
			if (i % 2 === 0) return point + moveBy.x;
			return point + moveBy.y;
		});

		changeRecord = modificationChangeRecord(object, { points: newPoints });
		object.points = newPoints;
	} else {
		const newPoint = {
			x: object.x + moveBy.x,
			y: object.y + moveBy.y,
		};

		changeRecord = modificationChangeRecord(object, newPoint);
		object.x = newPoint.x;
		object.y = newPoint.y;
	}

	return changeRecord;
}

export function moveLinePoint(line: Line, moveBy: Point, lineModification: { pointIndex: number }): ChangeRecord {
	const initialLine = { ...line };

	const xIndex = lineModification.pointIndex * 2;
	const points = [...line.points];
	points[xIndex] = points[xIndex] + moveBy.x;
	points[xIndex + 1] = points[xIndex + 1] + moveBy.y;

	line.points = points;

	return modificationChangeRecord(initialLine, { points: line.points });
}
