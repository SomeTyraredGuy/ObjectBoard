import { Side } from "../../Types/Canvas";

export default function iterateSidesAndCorners(
	side: Side,
	rightX: () => void,
	leftX: () => void,
	bottomY: () => void,
	topY: () => void
) {
	switch (side) {
		case Side.Right:
			rightX();
			break;

		case Side.Left:
			leftX();
			break;

		case Side.Top:
			topY();
			break;

		case Side.Bottom:
			bottomY();
			break;

		case Side.Top + Side.Left:
			leftX();
			topY();
			break;

		case Side.Right + Side.Top:
			topY();
			rightX();
			break;

		case Side.Bottom + Side.Left:
			leftX();
			bottomY();
			break;

		case Side.Bottom + Side.Right:
			rightX();
			bottomY();
			break;
	}
}
