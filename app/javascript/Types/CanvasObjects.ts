export enum CanvasObjectType {
    Rectangle = "Rectangle",
    Circle = "Circle",
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

export interface CommonCanvasObject {
    id: string,
    selected?  : boolean,
    type: CanvasObjectType,
    point: Point,
}

export interface Rectangle extends CommonCanvasObject, Size {
    type: CanvasObjectType.Rectangle,
}

export interface Circle extends CommonCanvasObject {
    type: CanvasObjectType.Circle,
    radiusX: number,
    radiusY: number,
}

export interface Text extends CommonCanvasObject {
    type: CanvasObjectType.Text,
    text: string,
}

export interface Line extends CommonCanvasObject {
    type: CanvasObjectType.Line,
    points: Array<Point>,
}

export type CanvasObject = Rectangle | Circle | Text | Line