import { CanvasObject, CanvasObjectType, Point } from "./CanvasObjects"

export enum Side {
    Top = 1,
    Bottom = 2,
    Left = 4,
    Right = 8, 
}

export type CanvasState = 
    | {
        mode: CanvasMode.None
    }
    | {
        mode: CanvasMode.Selected
        objects: CanvasObject[],
        movedBy?: Point, 
    }
    | {
        mode: CanvasMode.SelectionNet,
        origin: Point,
        current: Point,
    }
    | {
        mode: CanvasMode.Inserting,
        objectType: CanvasObjectType,
    }


export enum CanvasMode {
    None = 'None',
    Selected = 'Selected',
    SelectionNet = 'SelectionNet',
    Inserting = 'Inserting',
    Pressing = 'Pressing',
    Resizing = 'Resizing',
}