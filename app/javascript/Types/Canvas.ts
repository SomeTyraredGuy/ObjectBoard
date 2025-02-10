import { CanvasObject, CanvasObjectType, Point, Size } from "./CanvasObjects"

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
        object: CanvasObject,
    }
    | {
        mode: CanvasMode.SelectionNet,
        origin: Point,
        current?: Point,
    }
    | {
        mode: CanvasMode.Inserting,
        objectType: CanvasObjectType,
    }
    | {
        mode: CanvasMode.Pressing,
        origin: Point,
    }
    | {
        mode: CanvasMode.Resizing,
    }


export enum CanvasMode {
    None = 'None',
    Selected = 'Selected',
    SelectionNet = 'SelectionNet',
    Inserting = 'Inserting',
    Pressing = 'Pressing',
    Resizing = 'Resizing',
}