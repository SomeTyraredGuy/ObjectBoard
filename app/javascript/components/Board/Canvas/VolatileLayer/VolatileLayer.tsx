import { CanvasMode } from "@/Types/Canvas";
import Konva from "konva";
import React from "react";
import SelectionNet from "./SelectionNet";
import { UseCanvasState } from "../../CanvasStateContext";
import { Layer } from "react-konva";
import Selected from "./Selected";
import { CanvasObject } from "@/Types/CanvasObjects";
import Object from "../ObjectNode";

type Props = {
	stageRef: React.RefObject<Konva.Stage>;
	scale: number;
	temporaryObject: CanvasObject | null;
};

function VolatileLayer({ stageRef, scale, temporaryObject }: Props) {
	const { canvasState } = UseCanvasState();

	let content: React.ReactNode = null;
	switch (canvasState.mode) {
		case CanvasMode.SelectionNet:
			content = <SelectionNet stageRef={stageRef} scale={scale} />;
			break;

		case CanvasMode.Selected:
			content = <Selected stageRef={stageRef} scale={scale} />;
			break;

		case CanvasMode.Inserting:
			if (!temporaryObject) break;

			content = <Object object={temporaryObject} />;
			break;

		default:
			content = null;
	}

	return <Layer>{content}</Layer>;
}

export default VolatileLayer;
