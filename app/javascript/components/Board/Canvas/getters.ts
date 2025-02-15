import { Stage } from "konva/lib/Stage";
import { CanvasObject, CanvasObjectType, Point } from "../../../Types/CanvasObjects";

function getCursorOnCanvas(stage: Stage | null, scale: number): Point | null {
    if (!stage) return null
    const pointerPosition = stage?.getPointerPosition()
    if (!pointerPosition) return null

    return {
        x: (pointerPosition.x - stage.x()) / scale,
        y: (pointerPosition.y - stage.y()) / scale,
    }
}

function getOverlappingObjects(objects: CanvasObject[], point1: Point, point2: Point): CanvasObject[] {
    const overlappingObjects: CanvasObject[] = []
    let leftX1: number, rightX1: number, topY1: number, bottomY1: number
    let leftX2: number, rightX2: number, topY2: number, bottomY2: number
    
    if (point1.x > point2.x) {
        leftX1 = point2.x
        rightX1 = point1.x
    } else {
        leftX1 = point1.x
        rightX1 = point2.x
    }
    if (point1.y > point2.y) {
        topY1 = point2.y
        bottomY1 = point1.y
    } else {
        topY1 = point1.y
        bottomY1 = point2.y
    }

    objects.forEach(object => {
        switch (object.type) {
            case CanvasObjectType.Rectangle:
                leftX2 = object.x
                rightX2 = object.x + object.width
                topY2 = object.y
                bottomY2 = object.y + object.height
                break;

            case CanvasObjectType.Ellipse:
                leftX2 = object.x - object.radiusX
                rightX2 = object.x + object.radiusX
                topY2 = object.y - object.radiusY
                bottomY2 = object.y + object.radiusY
                break;

            case CanvasObjectType.Text:
                leftX2 = object.x
                rightX2 = object.x + object.text.length * 10
                topY2 = object.y
                bottomY2 = object.y + 10
                break;

            case CanvasObjectType.Line:
                for (let i = 0; i < object.points.length; i += 2) {
                    const pointX = object.points[i];
                    const pointY = object.points[i + 1];
                    leftX2 = Math.min(leftX2, pointX);
                    rightX2 = Math.max(rightX2, pointX);
                    topY2 = Math.min(topY2, pointY);
                    bottomY2 = Math.max(bottomY2, pointY);
                }
                break;

            default:
                return
        }
            
        if (leftX1 < rightX2 && leftX2 < rightX1 && topY1 < bottomY2 && topY2 < bottomY1) {
            overlappingObjects.push(object)
        }
    })

    return overlappingObjects
}

function getDirection(startingPoint: Point, currentPoint: Point): {xRight: boolean, yBottom: boolean} {
    return {
        xRight: currentPoint.x > startingPoint.x,
        yBottom: currentPoint.y < startingPoint.y,
    }
}

export { getCursorOnCanvas, getOverlappingObjects, getDirection }