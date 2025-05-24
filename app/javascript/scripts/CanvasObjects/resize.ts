import { Side } from "../../Types/Canvas";
import { Ellipse, Line, Text, Point, Rectangle, XYWH } from "../../Types/CanvasObjects";
import { ChangeRecord } from "../../Types/History";
import { modificationChangeRecord } from "../historyUtils";
import iterateSidesAndCorners from "./iterateSidesAndCorners";

function getResizedByPercent(side: Side, currentPoint: Point, initialXYWH: XYWH): Point {
	const referencePointOnInitial: Point = { x: initialXYWH.x, y: initialXYWH.y };
	let newWidth = currentPoint.x - referencePointOnInitial.x;
	let newHeight = currentPoint.y - referencePointOnInitial.y;

	switch (side) {
		case Side.Left:
		case Side.Top:
		case Side.Top + Side.Left:
			referencePointOnInitial.x = initialXYWH.x + initialXYWH.width;
			referencePointOnInitial.y = initialXYWH.y + initialXYWH.height;
			newWidth = referencePointOnInitial.x - currentPoint.x;
			newHeight = referencePointOnInitial.y - currentPoint.y;
			break;

		case Side.Right + Side.Top:
			referencePointOnInitial.y = initialXYWH.y + initialXYWH.height;
			newHeight = referencePointOnInitial.y - currentPoint.y;
			break;

		case Side.Bottom + Side.Left:
			referencePointOnInitial.x = initialXYWH.x + initialXYWH.width;
			newWidth = referencePointOnInitial.x - currentPoint.x;
			break;
	}

	let resizedX = 1,
		resizedY = 1;
	switch (side) {
		case Side.Top:
		case Side.Bottom:
			resizedY = newHeight / initialXYWH.height;
			break;

		case Side.Left:
		case Side.Right:
			resizedX = newWidth / initialXYWH.width;
			break;

		default:
			resizedY = newHeight / initialXYWH.height;
			resizedX = newWidth / initialXYWH.width;
			break;
	}

	return {
		x: resizedX,
		y: resizedY,
	};
}

function resizeRectangle(
	rectangle: Rectangle | Text,
	resizedByPercent: Point,
	currentPoint: Point,
	initialSelectionNet: XYWH,
	initialRectangle: Rectangle,
	side: Side,
): ChangeRecord {
	rectangle.width = Math.abs(initialRectangle.width * resizedByPercent.x);
	rectangle.height = Math.abs(initialRectangle.height * resizedByPercent.y);

	let rightX = () => {
		rectangle.x = initialSelectionNet.x + (initialRectangle.x - initialSelectionNet.x) * resizedByPercent.x;
	};
	let leftX = () => {
		rectangle.x = currentPoint.x + (initialRectangle.x - initialSelectionNet.x) * resizedByPercent.x;
	};
	let bottomY = () => {
		rectangle.y = initialSelectionNet.y + (initialRectangle.y - initialSelectionNet.y) * resizedByPercent.y;
	};
	let topY = () => {
		rectangle.y = currentPoint.y + (initialRectangle.y - initialSelectionNet.y) * resizedByPercent.y;
	};

	if (resizedByPercent.x < 0) {
		const resizedByPercentX = Math.abs(resizedByPercent.x);
		rightX = () => {
			rectangle.x =
				currentPoint.x +
				(initialSelectionNet.x + initialSelectionNet.width - initialRectangle.x - initialRectangle.width) *
					resizedByPercentX;
		};
		leftX = () => {
			rectangle.x =
				initialSelectionNet.x +
				initialSelectionNet.width +
				(initialSelectionNet.x + initialSelectionNet.width - initialRectangle.x - initialRectangle.width) *
					resizedByPercentX;
		};
	}
	if (resizedByPercent.y < 0) {
		const resizedByPercentY = Math.abs(resizedByPercent.y);
		bottomY = () => {
			rectangle.y =
				currentPoint.y +
				(initialSelectionNet.y + initialSelectionNet.height - initialRectangle.y - initialRectangle.height) *
					resizedByPercentY;
		};
		topY = () => {
			rectangle.y =
				initialSelectionNet.y +
				initialSelectionNet.height +
				(initialSelectionNet.y + initialSelectionNet.height - initialRectangle.y - initialRectangle.height) *
					resizedByPercentY;
		};
	}

	iterateSidesAndCorners(side, rightX, leftX, bottomY, topY);

	return modificationChangeRecord(initialRectangle, {
		width: rectangle.width,
		height: rectangle.height,
		x: rectangle.x,
		y: rectangle.y,
	});
}

function resizeEllipse(
	ellipse: Ellipse,
	resizedByPercent: Point,
	currentPoint: Point,
	initialSelectionNet: XYWH,
	initialEllipse: Ellipse,
	side: Side,
) {
	const newRadiusX = initialEllipse.radiusX * resizedByPercent.x;
	const newRadiusY = initialEllipse.radiusY * resizedByPercent.y;
	ellipse.radiusX = Math.abs(newRadiusX);
	ellipse.radiusY = Math.abs(newRadiusY);

	const paddingX = () => (initialEllipse.x - initialEllipse.radiusX - initialSelectionNet.x) * resizedByPercent.x;
	const paddingY = () => (initialEllipse.y - initialEllipse.radiusY - initialSelectionNet.y) * resizedByPercent.y;

	const rightX = () => {
		ellipse.x = initialSelectionNet.x + newRadiusX + paddingX();
	};
	const leftX = () => {
		ellipse.x = currentPoint.x + newRadiusX + paddingX();
	};
	const bottomY = () => {
		ellipse.y = initialSelectionNet.y + newRadiusY + paddingY();
	};
	const topY = () => {
		ellipse.y = currentPoint.y + newRadiusY + paddingY();
	};

	iterateSidesAndCorners(side, rightX, leftX, bottomY, topY);

	return modificationChangeRecord(initialEllipse, {
		radiusX: ellipse.radiusX,
		radiusY: ellipse.radiusY,
		x: ellipse.x,
		y: ellipse.y,
	});
}

function resizeLine(
	line: Line,
	resizedByPercent: Point,
	currentPoint: Point,
	initialSelectionNet: XYWH,
	initialLine: Line,
	side: Side,
) {
	const points = [...line.points];

	const paddingX = (i) => (initialLine.points[i] - initialSelectionNet.x) * resizedByPercent.x;
	const paddingY = (i) => (initialLine.points[i] - initialSelectionNet.y) * resizedByPercent.y;

	const rightX = () => {
		for (let i = 0; i < points.length; i += 2) {
			points[i] = initialSelectionNet.x + paddingX(i);
		}
	};
	const leftX = () => {
		for (let i = 0; i < points.length; i += 2) {
			points[i] = currentPoint.x + paddingX(i);
		}
	};
	const bottomY = () => {
		for (let i = 1; i < points.length; i += 2) {
			points[i] = initialSelectionNet.y + paddingY(i);
		}
	};
	const topY = () => {
		for (let i = 1; i < points.length; i += 2) {
			points[i] = currentPoint.y + paddingY(i);
		}
	};

	iterateSidesAndCorners(side, rightX, leftX, bottomY, topY);

	line.points = points;

	return modificationChangeRecord(initialLine, {
		points: line.points,
	});
}

export { getResizedByPercent, resizeRectangle, resizeEllipse, resizeLine };
