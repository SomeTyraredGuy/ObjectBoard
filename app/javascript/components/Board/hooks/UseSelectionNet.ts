import { useEffect, useState } from "react"
import { Point, Size } from "../../../Types/CanvasObjects"

interface SelectionNet {
    isVisible: boolean,
    point: Point,
    size: Size,
}

export default function UseSelectionNet() {
    const [selectionNet, setSelectionNet] = useState<SelectionNet>({
        isVisible: false,
        point: {x: 0, y: 0},
        size: {width: 0, height: 0},
    })

    function setPoint(point: Point) {
        setSelectionNet({
            ...selectionNet,
            point: point,
            isVisible: true
        })
    }

    function setSize(size: Size) {
        setSelectionNet({
            ...selectionNet,
            size: size,
        })
    }

    function hide() {
        setSelectionNet({
            ...selectionNet,
            isVisible: false,
            size: {width: 0, height: 0}
        })
    }

    return {
        selectionNet,
        setPoint,
        setSize,
        hide,
    }
}