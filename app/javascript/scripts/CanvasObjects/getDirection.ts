import { Point } from "../../Types/CanvasObjects";

type Props = {
	xRight: boolean;
	yBottom: boolean;
};

export default function getDirection(startingPoint: Point, currentPoint: Point): Props {
	return {
		xRight: currentPoint.x > startingPoint.x,
		yBottom: currentPoint.y < startingPoint.y,
	};
}
