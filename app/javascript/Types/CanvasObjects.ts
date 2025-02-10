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

export interface CommonCanvasObject extends Point {
    id: string,
    selected?  : boolean,
    type: CanvasObjectType,
}

export interface Rectangle extends CommonCanvasObject, Size {
    type: CanvasObjectType.Rectangle,
    width: number,
    height: number,
}

export interface Ellipse extends CommonCanvasObject {
    type: CanvasObjectType.Ellipse,
    radiusX: number,
    radiusY: number,
}

export interface Text extends CommonCanvasObject {
    type: CanvasObjectType.Text,
    text: string,
}

export interface Line extends CommonCanvasObject {
    type: CanvasObjectType.Line,
    points: Array<number>,
    stroke: string,
}

export type CanvasObject = Rectangle | Ellipse | Text | Line