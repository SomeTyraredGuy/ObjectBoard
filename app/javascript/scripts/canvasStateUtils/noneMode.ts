import { CanvasMode, CanvasState } from "../../Types/Canvas";

export function setNoneMode(setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>) {
	setCanvasState({
		mode: CanvasMode.None,
	});
}
