import React from "react";
import { CanvasObject, CanvasObjectType } from "../../../Types/CanvasObjects";
import { Ellipse, Rect, Text, Line } from "react-konva";
import { CanvasMode } from "../../../Types/Canvas";
import { KonvaEventObject } from "konva/lib/Node";
import { CanvasStateUtils } from "../../../Types/CanvasStateUtils";
import { UseCanvasState } from "../CanvasStateContext";

type Props = {
	objectsBlocked: boolean;
	canvasObjects: CanvasObject[];
	temporaryObject: CanvasObject | null;
};

function Objects({ objectsBlocked, canvasObjects, temporaryObject }: Props) {
	const { canvasState, canvasStateUtils } = UseCanvasState();
	function onMouseEnter(e: KonvaEventObject<MouseEvent>) {
		if (objectsBlocked) return;

		const stage = e.target.getStage();
		if (!stage) return;
		stage.container().style.cursor = "move";
	}

	function onMouseLeave(e: KonvaEventObject<MouseEvent>) {
		if (objectsBlocked) return;

		const stage = e.target.getStage();
		if (!stage) return;
		stage.container().style.cursor = "default";
	}

	function onMouseDown(
		e: KonvaEventObject<MouseEvent>,
		canvasStateUtils: CanvasStateUtils,
		canvasState,
		object: CanvasObject,
	) {
		if (objectsBlocked) return;
		if (canvasState.mode !== CanvasMode.Selected && canvasState.mode !== CanvasMode.None) return;

		e.evt.preventDefault();

		if (canvasState.mode === CanvasMode.Selected && e.evt.ctrlKey) {
			canvasStateUtils.Selected.add(object);
			return;
		}

		canvasStateUtils.Selected.set([object]);
	}

	function renderObject(object: CanvasObject, i?: number) {
		const commonProps = {
			key: object.id ? object.id : i,
			stroke: object.stroke ? object.stroke : "none",
			strokeWidth: object.strokeWidth,
			opacity: object.opacity,

			onMouseEnter: onMouseEnter,
			onMouseLeave: onMouseLeave,

			onMouseDown: (e) => onMouseDown(e, canvasStateUtils, canvasState, object),
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
					/>
				);

			case CanvasObjectType.Line:
				return <Line {...commonProps} points={object.points} />;
		}
	}

	return (
		<>
			{canvasObjects.map((object, i) => {
				return renderObject(object, i);
			})}

			{temporaryObject && renderObject(temporaryObject, -1)}
		</>
	);
}

export default Objects;
