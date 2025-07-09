import { CanvasMode } from "@/Types/Canvas";
import Konva from "konva";
import React from "react";
import SelectionNet from "./SelectionNet";
import { UseCanvasState } from "../../CanvasStateContext";
import { Layer } from "react-konva";

type Props = {
	stageRef: React.RefObject<Konva.Stage>;
	scale: number;
};

function VolatileLayer({ stageRef, scale }: Props) {
	const { canvasState } = UseCanvasState();

	return (
		<Layer>
			{canvasState.mode === CanvasMode.SelectionNet && <SelectionNet stageRef={stageRef} scale={scale} />}
		</Layer>
	);
}

export default VolatileLayer;
