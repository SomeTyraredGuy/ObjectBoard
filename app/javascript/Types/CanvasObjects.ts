export enum CanvasObjectType {
    Rectangle = "Rectangle",
    Ellipse = "Ellipse",
    Text = "Text",
    Line = "Line",
}

export interface Point {
    x: number,
    y: number,
}

export interface Size {
    width: number,
    height: number,
}

export interface XYWH extends Point, Size {}

export interface CommonCanvasObject {
    id: number,
    index?: number,
    type: CanvasObjectType,
    locked: boolean,
    stroke: string,
    strokeWidth: number,
    opacity: number
}

export interface Fill{
    fill: string,
}

export interface Rectangle extends CommonCanvasObject, Size, Point, Fill {
    type: CanvasObjectType.Rectangle,
    cornerRadius: number,
}

export interface Ellipse extends CommonCanvasObject, Point, Fill {
    type: CanvasObjectType.Ellipse,
    radiusX: number,
    radiusY: number,
}

export interface Text extends CommonCanvasObject, Point, Fill {
    type: CanvasObjectType.Text,
    text: string,
}

export interface Line extends CommonCanvasObject {
    type: CanvasObjectType.Line,
    points: number[],
}

export type CanvasObject = Rectangle | Ellipse | Text | Line
export const numOfObjectTypes = 4