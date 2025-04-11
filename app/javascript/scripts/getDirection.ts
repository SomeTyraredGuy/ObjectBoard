import { Point } from "../Types/CanvasObjects";

export default function getDirection(startingPoint: Point, currentPoint: Point): {xRight: boolean, yBottom: boolean} {
    return {
        xRight: currentPoint.x > startingPoint.x,
        yBottom: currentPoint.y < startingPoint.y,
    }
}