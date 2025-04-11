import { Side } from "../Types/Canvas"
import { Ellipse, Line, Text, Point, Rectangle, XYWH } from "../Types/CanvasObjects"
import { ChangeRecord } from "../hooks/Board/UseHistory"

function getResizedByPercent(side: Side, currentPoint: Point, initialXYWH: XYWH): Point {
    let referencePointOnInitial: Point = {x: initialXYWH.x, y: initialXYWH.y}
    let newWidth = currentPoint.x - referencePointOnInitial.x
    let newHeight = currentPoint.y - referencePointOnInitial.y

    switch (side) {
        case Side.Left:
        case Side.Top:
        case Side.Top + Side.Left:
            referencePointOnInitial.x = initialXYWH.x + initialXYWH.width
            referencePointOnInitial.y = initialXYWH.y + initialXYWH.height
            newWidth = referencePointOnInitial.x - currentPoint.x
            newHeight = referencePointOnInitial.y - currentPoint.y
            break

        case Side.Right + Side.Top:
            referencePointOnInitial.y = initialXYWH.y + initialXYWH.height
            newHeight = referencePointOnInitial.y - currentPoint.y
            break

        case Side.Bottom + Side.Left:
            referencePointOnInitial.x = initialXYWH.x + initialXYWH.width
            newWidth = referencePointOnInitial.x - currentPoint.x
            break
    }

    let resizedX = 1, resizedY = 1
    switch (side) {
        case Side.Top: 
        case Side.Bottom:
            resizedY = newHeight / initialXYWH.height
            break

        case Side.Left:
        case Side.Right:
            resizedX = newWidth / initialXYWH.width
            break
            
        default:
            resizedY = newHeight / initialXYWH.height
            resizedX = newWidth / initialXYWH.width
            break
    }

    return{
        x: resizedX,
        y: resizedY,
    }
}

function iterateSidesAndCorners(side: Side, rightX: () => void, leftX: () => void, bottomY: () => void, topY: () => void) {
    switch (side) {
        case Side.Right:
            rightX()
            break

        case Side.Left:
            leftX()
            break

        case Side.Top:
            topY()
            break

        case Side.Bottom:
            bottomY()
            break

        case Side.Top + Side.Left:
            leftX()
            topY()
            break

        case Side.Right + Side.Top:
            topY()
            rightX()
            break

        case Side.Bottom + Side.Left:
            leftX()
            bottomY()
            break

        case Side.Bottom + Side.Right:
            rightX()
            bottomY()
            break
    }
}

function resizeRectangle(rectangle: Rectangle, resizedByPercent: Point, currentPoint: Point, initialSelectionNet: XYWH, initialRectangle: Rectangle, side: Side): ChangeRecord {
    let changeRecord: ChangeRecord= {
        id: initialRectangle.id,
        type: initialRectangle.type,
        oldProperties: {
            width: initialRectangle.width,
            height: initialRectangle.height,
            x: initialRectangle.x,
            y: initialRectangle.y,
        },
        newProperties: null
    }

    rectangle.width = Math.abs(initialRectangle.width * resizedByPercent.x)
    rectangle.height = Math.abs(initialRectangle.height * resizedByPercent.y)

    let rightX = () => {rectangle.x = initialSelectionNet.x + (initialRectangle.x - initialSelectionNet.x) * resizedByPercent.x}
    let leftX = () => {rectangle.x = currentPoint.x + (initialRectangle.x - initialSelectionNet.x) * resizedByPercent.x}
    let bottomY = () => {rectangle.y = initialSelectionNet.y + (initialRectangle.y - initialSelectionNet.y) * resizedByPercent.y}
    let topY = () => {rectangle.y = currentPoint.y + (initialRectangle.y - initialSelectionNet.y) * resizedByPercent.y}

    if (resizedByPercent.x < 0){
        const resizedByPercentX = Math.abs(resizedByPercent.x)
        rightX = () => {rectangle.x = currentPoint.x + (initialSelectionNet.x + initialSelectionNet.width - initialRectangle.x - initialRectangle.width) * resizedByPercentX}
        leftX = () => {rectangle.x = initialSelectionNet.x + initialSelectionNet.width + (initialSelectionNet.x + initialSelectionNet.width - initialRectangle.x - initialRectangle.width) * resizedByPercentX}
    } 
    if (resizedByPercent.y < 0){
        const resizedByPercentY = Math.abs(resizedByPercent.y)
        bottomY = () => {rectangle.y = currentPoint.y + (initialSelectionNet.y + initialSelectionNet.height - initialRectangle.y - initialRectangle.height) * resizedByPercentY}
        topY = () => {rectangle.y = initialSelectionNet.y + initialSelectionNet.height + (initialSelectionNet.y + initialSelectionNet.height - initialRectangle.y - initialRectangle.height) * resizedByPercentY}
    }

    iterateSidesAndCorners(side, rightX, leftX, bottomY, topY)

    changeRecord.newProperties= {
        width: rectangle.width,
        height: rectangle.height,
        x: rectangle.x,
        y: rectangle.y,
    }
    return changeRecord
}

function resizeEllipse(ellipse: Ellipse, resizedByPercent: Point, currentPoint: Point, initialSelectionNet: XYWH, initialEllipse: Ellipse, side: Side) {
    let changeRecord: ChangeRecord= {
        id: initialEllipse.id,
        type: initialEllipse.type,
        oldProperties: {
            radiusX: initialEllipse.radiusX,
            radiusY: initialEllipse.radiusY,
            x: initialEllipse.x,
            y: initialEllipse.y,
        },
        newProperties: null
    }

    const newRadiusX = initialEllipse.radiusX * resizedByPercent.x
    const newRadiusY = initialEllipse.radiusY * resizedByPercent.y
    ellipse.radiusX = Math.abs(newRadiusX)
    ellipse.radiusY = Math.abs(newRadiusY)

    const paddingX = () => (initialEllipse.x - initialEllipse.radiusX - initialSelectionNet.x) * resizedByPercent.x
    const paddingY = () => (initialEllipse.y - initialEllipse.radiusY - initialSelectionNet.y) * resizedByPercent.y

    let rightX = () => {ellipse.x = initialSelectionNet.x + newRadiusX + paddingX()}
    let leftX = () => {ellipse.x = currentPoint.x + newRadiusX + paddingX()}
    let bottomY = () => {ellipse.y = initialSelectionNet.y + newRadiusY + paddingY()}
    let topY = () => {ellipse.y = currentPoint.y + newRadiusY + paddingY()}

    iterateSidesAndCorners(side, rightX, leftX, bottomY, topY)

    changeRecord.newProperties= {
        radiusX: ellipse.radiusX,
        radiusY: ellipse.radiusY,
        x: ellipse.x,
        y: ellipse.y,
    }
    return changeRecord
}

function resizeLine(line: Line, resizedByPercent: Point, currentPoint: Point, initialSelectionNet: XYWH, initialLine: Line, side: Side) {
    let changeRecord: ChangeRecord= {
        id: initialLine.id,
        type: initialLine.type,
        oldProperties: {
            points: initialLine.points
        },
        newProperties: null
    }

    let points = [...line.points]

    const paddingX = (i) => (initialLine.points[i] - initialSelectionNet.x) * resizedByPercent.x
    const paddingY = (i) => (initialLine.points[i] - initialSelectionNet.y) * resizedByPercent.y

    let rightX = () => {
         for (let i = 0; i < points.length; i += 2){
            points[i] = initialSelectionNet.x + paddingX(i)
         }
     }
    let leftX = () => {
        for (let i = 0; i < points.length; i += 2){
            points[i] = currentPoint.x + paddingX(i)
        }
    }
    let bottomY = () => {
        for (let i = 1; i < points.length; i += 2){
            points[i] = initialSelectionNet.y + paddingY(i)
        }
    }
    let topY = () => {
        for (let i = 1; i < points.length; i += 2){
            points[i] = currentPoint.y + paddingY(i)
        }
    }

    iterateSidesAndCorners(side, rightX, leftX, bottomY, topY)

    line.points = points

    changeRecord.newProperties = {
        points: line.points
    }
    return changeRecord
}

function resizeText(text: Text, resizedByPercent: Point, currentPoint: Point, initialSelectionNet: XYWH, initialText: Text, side: Side) {
    // let changeRecord: ChangeRecord= {
    //     id: initialText.id,
    //     type: initialText.type,
    //     oldProperties: {

    //     },
    //     newProperties: null
    // }

    // TODO: text resizing by dragging

    // changeRecord.newProperties = {

    // }
    // return changeRecord
}

export { getResizedByPercent, resizeRectangle, resizeEllipse, resizeLine, resizeText }