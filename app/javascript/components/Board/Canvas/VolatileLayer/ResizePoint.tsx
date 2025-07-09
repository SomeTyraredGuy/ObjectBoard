import React from "react";
import { Point, XYWH } from "../../../../Types/CanvasObjects";
import { Circle } from "react-konva";
import { CanvasMode, CanvasState, Side } from "../../../../Types/Canvas";
import { onMouseLeave } from "../../../../scripts/moveStyleCursorEvents";
import { KonvaEventObject } from "konva/lib/Node";
import { getSideCursorStyle } from "../../../../scripts/getSideCursorStyle";
import { CanvasStateUtils } from "@/Types/CanvasStateUtils";

type Props = {
	point: Point;
	scale: number;
	side: Side;
	selectionNet: XYWH;
	canvasState: CanvasState;
	canvasStateUtils: CanvasStateUtils;
};

function ResizePoint({ point, scale, side, selectionNet, canvasState, canvasStateUtils }: Props) {
	const cursor = getSideCursorStyle(side);

	function onMouseEnter(e: KonvaEventObject<MouseEvent>) {
		const stage = e.target.getStage();
		if (!stage) return;
		stage.container().style.cursor = cursor;
	}

	function onMouseDown(e: KonvaEventObject<MouseEvent>) {
		e.evt.preventDefault();
		if (canvasState.mode !== CanvasMode.Selected) return;

		canvasStateUtils.Selected.resize({
			side: side,
			initialSelectionNet: selectionNet,
			initialSelectedObjects: canvasState.objects,
		});
	}

	return (
		<Circle
			{...point}
			stroke="white"
			opacity={0.7}
			fill="black"
			strokeWidth={1 / scale}
			radius={8 / scale}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onMouseDown={onMouseDown}
		/>
	);
}

export default ResizePoint;
