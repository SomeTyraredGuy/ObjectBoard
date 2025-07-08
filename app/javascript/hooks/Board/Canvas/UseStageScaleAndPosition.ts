import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useState } from "react";
const SCALE_BOUNDS = { min: 0.1, max: 20 };
const SCALE_BY = 1.1;

const getLimitedScale = (scale: number, min: number, max: number) => Math.max(min, Math.min(scale, max));

type Props = {
	stageRef: React.RefObject<Konva.Stage>;
};

export default function UseStageScaleAndPosition({ stageRef }: Props): {
	onWheel: (e: KonvaEventObject<WheelEvent>) => void;
	onMouseDown: (e: KonvaEventObject<MouseEvent>) => void;
	onDragEnd: (e: KonvaEventObject<MouseEvent>) => void;
	scale: number;
} {
	const [scale, setStageScale] = useState(1);

	const onWheel = (e: KonvaEventObject<WheelEvent>) => {
		e.evt.preventDefault();
		const stage = e.target.getStage();
		if (!stage) return;

		const oldScale = stage.scaleX();

		const pointerPosition = stage?.getPointerPosition();
		if (!pointerPosition) return;

		const mousePointTo = {
			x: (pointerPosition.x - stage.x()) / oldScale,
			y: (pointerPosition.y - stage.y()) / oldScale,
		};

		const newScale = e.evt.deltaY < 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY;

		const finalScale = getLimitedScale(newScale, SCALE_BOUNDS.min, SCALE_BOUNDS.max);

		stage.scale({ x: finalScale, y: finalScale });
		stage.position({
			x: pointerPosition.x - mousePointTo.x * finalScale,
			y: pointerPosition.y - mousePointTo.y * finalScale,
		});
		setStageScale(finalScale);
	};

	const onMouseDown = (e: KonvaEventObject<MouseEvent>) => {
		if (e.evt.button !== 2 || !stageRef.current) {
			return;
		}

		stageRef.current.startDrag();
		stageRef.current.container().style.cursor = "grabbing";
	};

	const onDragEnd = () => {
		stageRef.current.container().style.cursor = "default";
	};

	return { onWheel, onMouseDown, onDragEnd, scale };
}
