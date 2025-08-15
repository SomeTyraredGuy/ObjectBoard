import React from "react";
import { Line, Point } from "../../../../Types/CanvasObjects";
import LinePoint from "./LinePoint";
import { CanvasStateUtils } from "@/Types/CanvasStateUtils";
import { CanvasState } from "@/Types/Canvas";

type Props = {
	line: Line;
	scale: number;
	canvasState: CanvasState;
	canvasStateUtils: CanvasStateUtils;
};

function LineSelectionLayer({ line, scale, canvasState, canvasStateUtils }: Props) {
	const points: Point[] = [];
	for (let i = 0; i < line.points.length; i += 2) {
		points.push({
			x: line.points[i],
			y: line.points[i + 1],
		});
	}

	return (
		<>
			{points.map((point, i) => {
				return (
					<LinePoint
						key={i}
						point={point}
						pointIndex={i}
						scale={scale}
						canvasState={canvasState}
						canvasStateUtils={canvasStateUtils}
					/>
				);
			})}
		</>
	);
}

export default LineSelectionLayer;
