import { Ellipse, Rect, Text, Line } from "react-konva";
import { CanvasObject, CanvasObjectType } from "@/Types/CanvasObjects";
import React from "react";
import Konva from "konva";

type Props = {
	object: CanvasObject;
	i?: number;
	onMouseEnter?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
	onMouseLeave?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
	onMouseDown?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
};

export default function ObjectNode({ object, i, onMouseEnter, onMouseLeave, onMouseDown }: Props) {
	const commonProps = {
		key: object.id ? object.id : i,
		stroke: object.stroke ? object.stroke : "none",
		strokeWidth: object.strokeWidth,
		opacity: object.opacity,

		onMouseEnter: onMouseEnter || (() => {}),
		onMouseLeave: onMouseLeave || (() => {}),
		onMouseDown: onMouseDown || (() => {}),
	};

	switch (object.type) {
		case CanvasObjectType.Rectangle:
			return (
				<Rect
					{...commonProps}
					x={object.x}
					y={object.y}
					width={object.width}
					height={object.height}
					fill={object.fill}
					cornerRadius={object.width * object.cornerRadius}
					ref={object.ref as React.Ref<Konva.Rect>}
				/>
			);

		case CanvasObjectType.Ellipse:
			return (
				<Ellipse
					{...commonProps}
					x={object.x}
					y={object.y}
					radiusX={object.radiusX}
					radiusY={object.radiusY}
					fill={object.fill}
					ref={object.ref as React.Ref<Konva.Ellipse>}
				/>
			);

		case CanvasObjectType.Text:
			return (
				<Text
					{...commonProps}
					x={object.x}
					y={object.y}
					text={object.text}
					fill={object.fill}
					width={object.width}
					height={object.height}
					align={object.align}
					verticalAlign={object.verticalAlign}
					ellipsis
					fontSize={object.fontSize}
					ref={object.ref as React.Ref<Konva.Text>}
				/>
			);

		case CanvasObjectType.Line:
			return <Line {...commonProps} points={object.points} ref={object.ref as React.Ref<Konva.Line>} />;
	}
}
