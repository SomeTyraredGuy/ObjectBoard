import Konva from "konva";

export enum CanvasObjectType {
	Rectangle = "Rectangle",
	Ellipse = "Ellipse",
	Text = "Text",
	Line = "Line",
}

export interface Point {
	x: number;
	y: number;
}

export interface Size {
	width: number;
	height: number;
}

export interface XYWH extends Point, Size {}

export interface CommonCanvasObject {
	id: number; // represent id in canvas_objects table. If negative, it's not saved in the database yet
	index?: number;
	type: CanvasObjectType;
	locked: boolean;
	stroke: string;
	strokeWidth: number;
	opacity: number;
	ref?: React.RefObject<Konva.Shape | null>;
}

export interface Fill {
	fill: string;
}

export interface Rectangle extends CommonCanvasObject, Size, Point, Fill {
	type: CanvasObjectType.Rectangle;
	cornerRadius: number;
}

export interface Ellipse extends CommonCanvasObject, Point, Fill {
	type: CanvasObjectType.Ellipse;
	radiusX: number;
	radiusY: number;
}

export interface Text extends CommonCanvasObject, Point, Fill, Size {
	type: CanvasObjectType.Text;
	text: string;
	align?: "left" | "center" | "right";
	verticalAlign?: "top" | "middle" | "bottom";
	fontSize: number;
}

export interface Line extends CommonCanvasObject {
	type: CanvasObjectType.Line;
	points: number[];
}

export type CanvasObject = Rectangle | Ellipse | Text | Line;
export const numOfObjectTypes = 4;

export function isCanvasObject(obj: unknown): obj is CanvasObject {
	if (!obj || typeof obj !== "object" || !("type" in obj)) return false;

	switch (obj.type) {
		case CanvasObjectType.Rectangle:
			return (
				"x" in obj && "y" in obj && "width" in obj && "height" in obj && "fill" in obj && "cornerRadius" in obj
			);

		case CanvasObjectType.Ellipse:
			return "x" in obj && "y" in obj && "fill" in obj && "radiusX" in obj && "radiusY" in obj;

		case CanvasObjectType.Text:
			return "x" in obj && "y" in obj && "fill" in obj && "text" in obj;

		case CanvasObjectType.Line:
			return "points" in obj && Array.isArray(obj.points);

		default:
			return false;
	}
}
