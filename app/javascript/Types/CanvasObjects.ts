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
    id?: number,
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
    stroke: string,
}

export type CanvasObject = Rectangle | Ellipse | Text | Line
export const numOfObjectTypes = 4

export const defaultRectangle: Rectangle = {
    type: CanvasObjectType.Rectangle,
    locked: false,
    stroke: "#000000",
    strokeWidth: 2,
    fill: "transparent",
    opacity: 1,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    cornerRadius: 0,
}

export const defaultEllipse: Ellipse = {
    type: CanvasObjectType.Ellipse,
    locked: false,
    stroke: "#000000",
    strokeWidth: 2,
    fill: "transparent",
    opacity: 1,
    x: 0,
    y: 0,
    radiusX: 0,
    radiusY: 0,
}

export const defaultText: Text = {
    type: CanvasObjectType.Text,
    locked: false,
    stroke: "none",
    strokeWidth: 2,
    fill: "#000000",
    opacity: 1,
    x: 0,
    y: 0,
    text: "Text",
}

export const defaultLine: Line = {
    type: CanvasObjectType.Line,
    locked: false,
    stroke: "#000000",
    strokeWidth: 2,
    opacity: 1,
    points: [0, 0, 0, 0],
}