import { CanvasMode } from "@/Types/Canvas";
import { CanvasObjectType } from "@/Types/CanvasObjects";
import Konva from "konva";
import React from "react";
import LineSelectionLayer from "./LineSelectionLayer";
import { UseCanvasState } from "../../CanvasStateContext";

type Props = {
	stageRef: React.RefObject<Konva.Stage>;
	scale: number;
};

function Selected({ stageRef, scale }: Props) {
	// const { canvasState, canvasStateUtils } = UseCanvasState();
	// if (
	// 	canvasState.mode === CanvasMode.Selected &&
	// 	canvasState.objects.length === 1 &&
	// 	canvasState.objects[0].type === CanvasObjectType.Line
	// ) {
	// 	return (
	// 		<LineSelectionLayer
	// 			line={canvasState.objects[0]}
	// 			scale={scale}
	// 			canvasState={canvasState}
	// 			canvasStateUtils={canvasStateUtils}
	// 		/>
	// 	);
	// }

	return <></>;
}

export default Selected;
