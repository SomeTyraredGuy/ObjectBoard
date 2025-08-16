import { useRef } from "react";
import { Rectangle, CanvasObjectType, Ellipse, Text, Line } from "../../../../Types/CanvasObjects";
import Konva from "konva";

export default function UseDefaultObjects() {
	const localID = useRef(0);

	const commonProps = {
		locked: false,
		opacity: 1,
		ref: useRef<Konva.Shape | null>(null),
	};

	function defaultRectangle(): Rectangle {
		localID.current--;
		return {
			...commonProps,
			id: localID.current,
			type: CanvasObjectType.Rectangle,
			stroke: "#000000",
			strokeWidth: 2,
			fill: "transparent",
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			cornerRadius: 0,
		};
	}

	function defaultEllipse(): Ellipse {
		localID.current--;
		return {
			...commonProps,
			id: localID.current,
			type: CanvasObjectType.Ellipse,
			stroke: "#000000",
			strokeWidth: 2,
			fill: "transparent",
			x: 0,
			y: 0,
			radiusX: 0,
			radiusY: 0,
		};
	}

	function defaultText(): Text {
		localID.current--;
		return {
			...commonProps,
			id: localID.current,
			type: CanvasObjectType.Text,
			stroke: "none",
			strokeWidth: 0,
			fill: "#000000",
			x: 0,
			y: 0,
			text: "Text",
			width: 100,
			height: 100,
			align: "center",
			verticalAlign: "middle",
			fontSize: 32,
		};
	}

	function defaultLine(): Line {
		localID.current--;
		return {
			...commonProps,
			id: localID.current,
			type: CanvasObjectType.Line,
			stroke: "#000000",
			strokeWidth: 2,
			points: [0, 0, 0, 0],
		};
	}

	return {
		defaultRectangle,
		defaultEllipse,
		defaultText,
		defaultLine,
	};
}
