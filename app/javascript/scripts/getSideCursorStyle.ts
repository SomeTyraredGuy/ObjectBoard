import { Side } from "../Types/Canvas";

export function getSideCursorStyle(side: Side): string {
	switch (side) {
		case Side.Top:
			return "ns-resize";

		case Side.Bottom:
			return "ns-resize";

		case Side.Left:
			return "ew-resize";

		case Side.Right:
			return "ew-resize";

		case Side.Top + Side.Left:
			return "nwse-resize";

		case Side.Top + Side.Right:
			return "nesw-resize";

		case Side.Bottom + Side.Left:
			return "nesw-resize";

		case Side.Bottom + Side.Right:
			return "nwse-resize";
	}

	return "default";
}
