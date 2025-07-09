import { getCursorOnCanvas } from "@/scripts/canvasUtils";
import { CanvasMode } from "@/Types/Canvas";
import Konva from "konva";
import React, { useEffect, useRef } from "react";
import { Rect } from "react-konva";
import { UseCanvasState } from "../../CanvasStateContext";

type Props = {
	stageRef: React.RefObject<Konva.Stage>;
	scale: number;
};

function SelectionNet({ stageRef, scale }: Props) {
	const { canvasState } = UseCanvasState();
	const selectionNetRef1 = useRef<Konva.Rect>(null);
	const selectionNetRef2 = useRef<Konva.Rect>(null);

	useEffect(() => {
		if (canvasState.mode !== CanvasMode.SelectionNet) return;

		selectionNetRef1.current.setAttrs({
			x: canvasState.origin.x,
			y: canvasState.origin.y,
			width: 0,
			height: 0,
		});
		selectionNetRef2.current.setAttrs({
			x: canvasState.origin.x,
			y: canvasState.origin.y,
			width: 0,
			height: 0,
		});

		const onMouseMove = () => {
			const current = getCursorOnCanvas(stageRef.current);
			if (!current || canvasState.mode !== CanvasMode.SelectionNet) return;

			const width = current.x - canvasState.origin.x;
			const height = current.y - canvasState.origin.y;

			if (selectionNetRef1.current === null || selectionNetRef2.current === null) return;
			selectionNetRef1.current.setAttrs({
				width: width,
				height: height,
			});
			selectionNetRef2.current.setAttrs({
				width: width,
				height: height,
			});
		};

		stageRef.current?.on("mousemove", onMouseMove);
		return () => {
			stageRef.current?.off("mousemove", onMouseMove);
		};
	}, []);

	const SELECTION_GENERAL_PROPERTIES = {
		fill: "transparent",
		opacity: 0.7,
		strokeWidth: 1 / scale,
	};

	return (
		<>
			<Rect ref={selectionNetRef1} stroke="white" lineJoin="round" {...SELECTION_GENERAL_PROPERTIES} />
			<Rect
				ref={selectionNetRef2}
				stroke="black"
				lineJoin="round"
				dash={[10 / scale, 10 / scale]}
				{...SELECTION_GENERAL_PROPERTIES}
			/>
		</>
	);
}

export default SelectionNet;
