import React, { useRef } from "react";
import { CanvasObject } from "../../../Types/CanvasObjects";
import { CanvasMode } from "../../../Types/Canvas";
import { KonvaEventObject } from "konva/lib/Node";
import { CanvasStateUtils } from "../../../Types/CanvasStateUtils";
import { UseCanvasState } from "../CanvasStateContext";
import Konva from "konva";
import ObjectNode from "@/components/Board/Canvas/ObjectNode";

type Props = {
	objectsBlocked: boolean;
	canvasObjects: CanvasObject[];
};

function Objects({ objectsBlocked, canvasObjects }: Props) {
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

	return (
		<>
			{canvasObjects.map((object, i) => {
				const handleMouseDown = (e: KonvaEventObject<MouseEvent>) =>
					onMouseDown(e, canvasStateUtils, canvasState, object);

				return (
					<ObjectNode
						key={i}
						object={object}
						onMouseEnter={onMouseEnter}
						onMouseLeave={onMouseLeave}
						onMouseDown={handleMouseDown}
					/>
				);
			})}

			{temporaryObject && renderObject(temporaryObject, -1)}
		</>
	);
}

export default Objects;
