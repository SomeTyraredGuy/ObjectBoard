import React from "react";
import { Line, Point } from "../../../../Types/CanvasObjects";
import { Layer } from "react-konva";
import LinePoint from "./LinePoint";
import { CanvasState } from "../../../../Types/Canvas";
import { CanvasStateUtils } from "../../../../Types/CanvasStateUtils";

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
		<Layer>
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
		</Layer>
	);
}

export default LineSelectionLayer;
