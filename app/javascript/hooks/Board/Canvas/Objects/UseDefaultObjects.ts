import { useRef } from "react"
import { Rectangle, CanvasObjectType, Ellipse, Text, Line } from "../../../../Types/CanvasObjects"


export default function UseDefaultObjects() {
    const localID = useRef(0)

    function defaultRectangle(): Rectangle{
        localID.current--
        return {
            id: localID.current,
            type: CanvasObjectType.Rectangle,
            locked: false,
            stroke: "#000000",
            strokeWidth: 2,
            fill: "transparent",
            opacity: 1,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            cornerRadius: 0,
        }
    } 

    function defaultEllipse(): Ellipse{
        localID.current--
        return {
            id: localID.current,
            type: CanvasObjectType.Ellipse,
            locked: false,
            stroke: "#000000",
            strokeWidth: 2,
            fill: "transparent",
            opacity: 1,
            x: 0,
            y: 0,
            radiusX: 0,
            radiusY: 0,
        }
    }

    function defaultText(): Text{
        localID.current--
        return {
            id: localID.current,
            type: CanvasObjectType.Text,
            locked: false,
            stroke: "none",
            strokeWidth: 2,
            fill: "#000000",
            opacity: 1,
            x: 0,
            y: 0,
            text: "Text",
        }
    }

    function defaultLine(): Line{
        localID.current--
        return {
            id: localID.current,
            type: CanvasObjectType.Line,
            locked: false,
            stroke: "#000000",
            strokeWidth: 2,
            opacity: 1,
            points: [0, 0, 0, 0],
        }
    }

    return {
        defaultRectangle,
        defaultEllipse,
        defaultText,
        defaultLine,
    }
}