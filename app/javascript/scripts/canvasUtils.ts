import { Stage } from "konva/lib/Stage";
import getDirection from "./getDirection";
import { Point } from "../Types/CanvasObjects";

const TOO_SMALL_DRAG = 5
function isTooSmallDrag(startingPoint: Point, currentPoint: Point): boolean{
    const { xRight, yBottom } = getDirection(startingPoint, currentPoint)

    if(!xRight && startingPoint.x - currentPoint.x > TOO_SMALL_DRAG) return false
    if(xRight && currentPoint.x - startingPoint.x > TOO_SMALL_DRAG) return false
    if(yBottom && currentPoint.y - startingPoint.y > TOO_SMALL_DRAG) return false
    if(!yBottom && startingPoint.y - currentPoint.y > TOO_SMALL_DRAG) return false

    return true
}

function getCursorOnCanvas(stage: Stage | null, scale: number): Point | null {
    if (!stage) return null
    const pointerPosition = stage?.getPointerPosition()
    if (!pointerPosition) return null

    return {
        x: (pointerPosition.x - stage.x()) / scale,
        y: (pointerPosition.y - stage.y()) / scale,
    }
}

export { isTooSmallDrag, getCursorOnCanvas }