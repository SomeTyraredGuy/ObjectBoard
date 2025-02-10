import { useState } from 'react'
import { CanvasObject, CanvasObjectType } from '../../../Types/CanvasObjects'
import { KonvaEventObject } from 'konva/lib/Node'

function setNewObjectProperties(objectType: CanvasObjectType, x: number, y: number, canvasObjects: CanvasObject[]): CanvasObject {
    const CommonObjectProps = {
        id: (canvasObjects.length+1).toString(),
        selected: true,
        x: x,
        y: y,
    }

     switch (objectType) {
        case CanvasObjectType.Rectangle:
            return {
                ...CommonObjectProps,
                type: objectType,
                width: 100,
                height: 100,
            }
        case CanvasObjectType.Ellipse:
            return {
                ...CommonObjectProps,
                type: objectType,
                radiusX: 100,
                radiusY: 100,
            }
        case CanvasObjectType.Text:
            return {
                ...CommonObjectProps,
                type: objectType,
                text: 'Text',
            }
        case CanvasObjectType.Line:
            return {
                ...CommonObjectProps,
                type: objectType,
                points: [0, 0, 200, 200],
                stroke: 'red',
            }
    }
}

export default function UseCanvasObjects({canvasState, setCanvasState}) {
    const [canvasObjects, setCanvasObjects] = useState<CanvasObject[]>([])

    function onClickCanvas(e: KonvaEventObject<MouseEvent>) {
        if (e.evt.button !== 0) {
            return;
        }
        e.evt.preventDefault()

        switch (canvasState.mode) {
            case 'Selected':
                // TODO: unselect all objects
                break
            case 'Inserting':
                setCanvasObjects([ ...canvasObjects, 
                    setNewObjectProperties(canvasState.objectType, e.evt.clientX, e.evt.clientY, canvasObjects)
                ])
                break
        }
    }

    return { canvasObjects, setCanvasObjects, onClickCanvas }
}