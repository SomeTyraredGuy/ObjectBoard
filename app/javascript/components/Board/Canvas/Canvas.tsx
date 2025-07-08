import React from "react";
import { Layer, Stage } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import Objects from "./Objects";
import SelectionLayer from "./SelectionLayer/SelectionLayer";
import { CanvasMode } from "../../../Types/Canvas";
import { CanvasObject } from "../../../Types/CanvasObjects";
import { UseCanvasState } from "../CanvasStateContext";
import Konva from "konva";
import UseStageScaleAndPosition from "@/hooks/Board/Canvas/UseStageScaleAndPosition";

type Props = {
	objectsBlocked: boolean;
	canvasObjects: CanvasObject[];
	canvasUseObjects: {
		temporaryObject: CanvasObject | null;
		onMouseDown: (e: KonvaEventObject<MouseEvent>) => void;
		onMouseMove: (e: KonvaEventObject<MouseEvent>) => void;
		onMouseUp: (e: KonvaEventObject<MouseEvent>) => void;
	};
	stageRef: React.RefObject<Konva.Stage>;
	objectsLayerRef: React.RefObject<Konva.Layer>;
};

function Canvas({ objectsBlocked, canvasObjects, canvasUseObjects, stageRef, objectsLayerRef }: Props) {
	const { canvasState } = UseCanvasState();
	const {
		temporaryObject,
		onMouseDown: onMouseDownUseObjects,
		onMouseMove: onMouseMoveUseObjects,
		onMouseUp: onMouseUpUseObjects,
	} = canvasUseObjects;

	const {
		onWheel,
		onMouseDown: onMouseDownUseScale,
		onDragEnd: onDragEndUseScale,
		scale,
	} = UseStageScaleAndPosition({ stageRef });

	return (
		<>
			<Stage
				className="bg-white"
				width={window.innerWidth}
				height={window.innerHeight}
				onWheel={onWheel}
				onMouseMove={(e) => {
					onMouseMoveUseObjects(e);
				}}
				onMouseDown={(e) => {
					onMouseDownUseScale(e);
					onMouseDownUseObjects(e);
				}}
				onMouseUp={(e) => {
					onMouseUpUseObjects(e);
				}}
				onDragEnd={onDragEndUseScale}
				onContextMenu={(e: KonvaEventObject<MouseEvent>) => e.evt.preventDefault()}
				ref={stageRef}
			>
				<Layer ref={objectsLayerRef}>
					<Objects
						objectsBlocked={objectsBlocked}
						canvasObjects={canvasObjects}
						temporaryObject={temporaryObject}
					/>
				</Layer>

				{(canvasState.mode === CanvasMode.SelectionNet || canvasState.mode === CanvasMode.Selected) && (
					<SelectionLayer scale={scale} />
				)}
			</Stage>
		</>
	);
}

export default Canvas;
