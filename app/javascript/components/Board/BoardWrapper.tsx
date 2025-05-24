import React from "react";
import { CanvasStateProvider } from "./CanvasStateContext";
import Board from "./Board";

function BoardWrapper() {
	return (
		<CanvasStateProvider>
			<Board />
		</CanvasStateProvider>
	);
}

export default BoardWrapper;
