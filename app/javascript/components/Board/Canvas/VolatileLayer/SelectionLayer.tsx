// MAY BE USEFUL IN SELECTION REWORK

// import React, { useEffect, useRef, useState } from "react";
// import { Layer, Rect } from "react-konva";
// import { CanvasMode, Side } from "../../../../Types/Canvas";
// import { CanvasObjectType, Point, XYWH } from "../../../../Types/CanvasObjects";
// import LineSelectionLayer from "./LineSelectionLayer";
// import ResizePoint from "./ResizePoint";
// import { onMouseEnter, onMouseLeave } from "../../../../scripts/moveStyleCursorEvents";
// import { getXYWH } from "../../../../scripts/CanvasObjects/getXYWH";
// import { UseCanvasState } from "../../CanvasStateContext";
// import { KonvaEventObject } from "konva/lib/Node";
// import Konva from "konva";
// import { getCursorOnCanvas } from "@/scripts/canvasUtils";

// const RESIZE_POINTS = [
// 	{
// 		side: Side.Top,
// 		calcPoint: (XYWH: XYWH) => {
// 			return {
// 				x: XYWH.x + XYWH.width / 2,
// 				y: XYWH.y,
// 			};
// 		},
// 	},
// 	{
// 		side: Side.Bottom,
// 		calcPoint: (XYWH: XYWH) => {
// 			return {
// 				x: XYWH.x + XYWH.width / 2,
// 				y: XYWH.y + XYWH.height,
// 			};
// 		},
// 	},
// 	{
// 		side: Side.Left,
// 		calcPoint: (XYWH: XYWH) => {
// 			return {
// 				x: XYWH.x,
// 				y: XYWH.y + XYWH.height / 2,
// 			};
// 		},
// 	},
// 	{
// 		side: Side.Right,
// 		calcPoint: (XYWH: XYWH) => {
// 			return {
// 				x: XYWH.x + XYWH.width,
// 				y: XYWH.y + XYWH.height / 2,
// 			};
// 		},
// 	},
// 	{
// 		side: Side.Top + Side.Left,
// 		calcPoint: (XYWH: XYWH) => {
// 			return {
// 				x: XYWH.x,
// 				y: XYWH.y,
// 			};
// 		},
// 	},
// 	{
// 		side: Side.Top + Side.Right,
// 		calcPoint: (XYWH: XYWH) => {
// 			return {
// 				x: XYWH.x + XYWH.width,
// 				y: XYWH.y,
// 			};
// 		},
// 	},
// 	{
// 		side: Side.Bottom + Side.Left,
// 		calcPoint: (XYWH: XYWH) => {
// 			return {
// 				x: XYWH.x,
// 				y: XYWH.y + XYWH.height,
// 			};
// 		},
// 	},
// 	{
// 		side: Side.Bottom + Side.Right,
// 		calcPoint: (XYWH: XYWH) => {
// 			return {
// 				x: XYWH.x + XYWH.width,
// 				y: XYWH.y + XYWH.height,
// 			};
// 		},
// 	},
// ];

// type Props = {
// 	stageRef: React.RefObject<Konva.Stage>;
// 	scale: number;
// };

// function SelectionLayer({ stageRef, scale }: Props) {
// 	const { canvasState, canvasStateUtils } = UseCanvasState();

// 	if (
// 		canvasState.mode === CanvasMode.Selected &&
// 		canvasState.objects.length === 1 &&
// 		canvasState.objects[0].type === CanvasObjectType.Line
// 	) {
// 		return (
// 			<LineSelectionLayer
// 				line={canvasState.objects[0]}
// 				scale={scale}
// 				canvasState={canvasState}
// 				canvasStateUtils={canvasStateUtils}
// 			/>
// 		);
// 	}

// 	return (
// 		<Layer>
// 			{/* {canvasState.mode === CanvasMode.Selected && (
// 				<>
// 					{RESIZE_POINTS.map((point, i) => {
// 						if (!XYWH.current) return null;

// 						return (
// 							<ResizePoint
// 								point={point.calcPoint(XYWH.current)}
// 								side={point.side}
// 								scale={scale}
// 								selectionNet={XYWH.current}
// 								key={i}
// 								canvasState={canvasState}
// 								canvasStateUtils={canvasStateUtils}
// 							/>
// 						);
// 					})}
// 				</>
// 			)} */}
// 		</Layer>
// 	);
// }

// export default SelectionLayer;
