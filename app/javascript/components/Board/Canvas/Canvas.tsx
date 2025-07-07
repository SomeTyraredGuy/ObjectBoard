import React from "react";
import { Layer, Stage } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import Objects from "./Objects";
import SelectionLayer from "./SelectionLayer/SelectionLayer";
import { CanvasMode } from "../../../Types/Canvas";
import { CanvasObject, Point } from "../../../Types/CanvasObjects";
import { UseCanvasState } from "../CanvasStateContext";
import Konva from "konva";

type Props = {
	objectsBlocked: boolean;
	canvasObjects: CanvasObject[];
	canvasUseObjects: {
		temporaryObject: CanvasObject | null;
		onMouseDown: (e: KonvaEventObject<MouseEvent>) => void;
		onMouseMove: (e: KonvaEventObject<MouseEvent>) => void;
		onMouseUp: (e: KonvaEventObject<MouseEvent>) => void;
	};
	canvasStageScaleAndPosition: {
		onWheel: (e: KonvaEventObject<MouseEvent>) => void;
		onMouseMove: (e: KonvaEventObject<MouseEvent>) => void;
		onMouseDown: (e: KonvaEventObject<MouseEvent>) => void;
		onMouseUp: (e: KonvaEventObject<MouseEvent>) => void;
		stagePosition: Point;
		stageScale: number;
		isDragging: boolean;
	};
	stageRef: React.RefObject<Konva.Stage>;
	objectsLayerRef: React.RefObject<Konva.Layer>;
};

function Canvas({
	objectsBlocked,
	canvasObjects,
	canvasUseObjects,
	canvasStageScaleAndPosition,
	stageRef,
	objectsLayerRef,
}: Props) {
	const { canvasState } = UseCanvasState();
	const {
		temporaryObject,
		onMouseDown: onMouseDownUseObjects,
		onMouseMove: onMouseMoveUseObjects,
		onMouseUp: onMouseUpUseObjects,
	} = canvasUseObjects;

	const {
		onWheel,
		onMouseMove: onMouseMoveUseScale,
		onMouseDown: onMouseDownUseScale,
		onMouseUp: onMouseUpUseScale,
		stagePosition,
		stageScale,
		isDragging,
	} = canvasStageScaleAndPosition;

	return (
		<>
			<Stage
				className="bg-white"
				style={{ cursor: isDragging ? "grab" : "default" }}
				width={window.innerWidth}
				height={window.innerHeight}
				scale={{ x: stageScale, y: stageScale }}
				onWheel={onWheel}
				onMouseMove={(e) => {
					onMouseMoveUseScale(e);
					onMouseMoveUseObjects(e);
				}}
				onMouseDown={(e) => {
					onMouseDownUseScale(e);
					onMouseDownUseObjects(e);
				}}
				onMouseUp={(e) => {
					onMouseUpUseScale(e);
					onMouseUpUseObjects(e);
				}}
				onContextMenu={(e: KonvaEventObject<MouseEvent>) => e.evt.preventDefault()}
				{...stagePosition}
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
					<SelectionLayer scale={stageScale} />
				)}
			</Stage>
		</>
	);
}

export default Canvas;
