import React, { useRef } from "react";
import { Layer, Rect } from "react-konva";
import { CanvasMode, CanvasState, Side } from "../../../../Types/Canvas";
import { CanvasObjectType, XYWH } from "../../../../Types/CanvasObjects";
import LineSelectionLayer from "./LineSelectionLayer";
import ResizePoint from "./ResizePoint";
import { onMouseEnter, onMouseLeave } from "../../../../scripts/moveStyleCursorEvents";
import { CanvasStateUtils } from "../../../../Types/CanvasStateUtils";
import { getXYWH } from "../../../../scripts/CanvasObjects/getXYWH";

const RESIZE_POINTS = [
	{
		side: Side.Top,
		calcPoint: (XYWH: XYWH) => {
			return {
				x: XYWH.x + XYWH.width / 2,
				y: XYWH.y,
			};
		},
	},
	{
		side: Side.Bottom,
		calcPoint: (XYWH: XYWH) => {
			return {
				x: XYWH.x + XYWH.width / 2,
				y: XYWH.y + XYWH.height,
			};
		},
	},
	{
		side: Side.Left,
		calcPoint: (XYWH: XYWH) => {
			return {
				x: XYWH.x,
				y: XYWH.y + XYWH.height / 2,
			};
		},
	},
	{
		side: Side.Right,
		calcPoint: (XYWH: XYWH) => {
			return {
				x: XYWH.x + XYWH.width,
				y: XYWH.y + XYWH.height / 2,
			};
		},
	},
	{
		side: Side.Top + Side.Left,
		calcPoint: (XYWH: XYWH) => {
			return {
				x: XYWH.x,
				y: XYWH.y,
			};
		},
	},
	{
		side: Side.Top + Side.Right,
		calcPoint: (XYWH: XYWH) => {
			return {
				x: XYWH.x + XYWH.width,
				y: XYWH.y,
			};
		},
	},
	{
		side: Side.Bottom + Side.Left,
		calcPoint: (XYWH: XYWH) => {
			return {
				x: XYWH.x,
				y: XYWH.y + XYWH.height,
			};
		},
	},
	{
		side: Side.Bottom + Side.Right,
		calcPoint: (XYWH: XYWH) => {
			return {
				x: XYWH.x + XYWH.width,
				y: XYWH.y + XYWH.height,
			};
		},
	},
];

type Props = {
	canvasState: CanvasState;
	canvasStateUtils: CanvasStateUtils;
	scale: number;
};

function SelectionLayer({ canvasState, canvasStateUtils, scale }: Props) {
	if (
		canvasState.mode === CanvasMode.Selected &&
		canvasState.objects.length === 1 &&
		canvasState.objects[0].type === CanvasObjectType.Line
	) {
		return (
			<LineSelectionLayer
				line={canvasState.objects[0]}
				scale={scale}
				canvasState={canvasState}
				canvasStateUtils={canvasStateUtils}
			/>
		);
	}

	const XYWH = useRef<XYWH | null>(null);
	XYWH.current = getXYWH(canvasState, XYWH.current);
	if (!XYWH.current) return null;

	const SELECTION_GENERAL_PROPERTIES = {
		x: XYWH.current.x,
		y: XYWH.current.y,
		width: XYWH.current.width,
		height: XYWH.current.height,
		fill: "transparent",
		opacity: 0.7,
		strokeWidth: 1 / scale,
	};

	return (
		<Layer>
			<Rect stroke="white" lineJoin="round" {...SELECTION_GENERAL_PROPERTIES} />
			<Rect
				stroke="black"
				lineJoin="round"
				dash={[10 / scale, 10 / scale]}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				{...SELECTION_GENERAL_PROPERTIES}
			/>
			{canvasState.mode === CanvasMode.Selected && (
				<>
					{RESIZE_POINTS.map((point, i) => {
						if (!XYWH.current) return null;

						return (
							<ResizePoint
								point={point.calcPoint(XYWH.current)}
								side={point.side}
								scale={scale}
								selectionNet={XYWH.current}
								key={i}
								canvasState={canvasState}
								canvasStateUtils={canvasStateUtils}
							/>
						);
					})}
				</>
			)}
		</Layer>
	);
}

export default SelectionLayer;
