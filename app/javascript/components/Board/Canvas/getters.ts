import { Stage } from "konva/lib/Stage";
import { Point } from "../../../Types/CanvasObjects";

function getCursorOnCanvas(stage: Stage | null, scale: number): Point | null {
    if (!stage) return null
    const pointerPosition = stage?.getPointerPosition()
    if (!pointerPosition) return null

    return {
        x: (pointerPosition.x - stage.x()) / scale,
        y: (pointerPosition.y - stage.y()) / scale,
    }
}

export {getCursorOnCanvas}