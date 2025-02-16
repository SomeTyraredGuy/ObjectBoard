export enum CanvasObjectType {
    Rectangle = "Rectangle",
    Ellipse = "Ellipse",
    Text = "Text",
    Line = "Line",
}

export type Color = {
    r: number,
    g: number,
    b: number, 
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
    id?: string,
    type: CanvasObjectType,
    locked : boolean,
}

export interface Rectangle extends CommonCanvasObject, Size, Point {
    type: CanvasObjectType.Rectangle,
}

export interface Ellipse extends CommonCanvasObject, Point {
    type: CanvasObjectType.Ellipse,
    radiusX: number,
    radiusY: number,
}

export interface Text extends CommonCanvasObject, Point {
    type: CanvasObjectType.Text,
    text: string,
}

export interface Line extends CommonCanvasObject {
    type: CanvasObjectType.Line,
    points: number[],
    stroke: string,
}

export type CanvasObject = Rectangle | Ellipse | Text | Line