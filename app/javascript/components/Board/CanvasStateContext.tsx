import React, { createContext, useContext, useState } from "react";
import { CanvasStateUtils } from "@/Types/CanvasStateUtils";
import { CanvasMode, CanvasState } from "@/Types/Canvas";
import createCanvasStateUtils from "@/scripts/canvasStateUtils/createCanvasStateUtils";

interface CanvasStateContextType {
	canvasState: CanvasState;
	canvasStateUtils: CanvasStateUtils;
}

const CanvasStateContext = createContext<CanvasStateContextType | undefined>(undefined);

export const UseCanvasState = (): CanvasStateContextType => {
	const context = useContext(CanvasStateContext);
	if (context === undefined) {
		throw new Error("useCanvasState must be used within a CanvasStateProvider");
	}
	return context;
};

interface Props {
	children: React.ReactNode;
}

export const CanvasStateProvider: React.FC<Props> = ({ children }) => {
	const [canvasState, setCanvasState] = useState<CanvasState>({
		mode: CanvasMode.None,
	});
	const canvasStateUtils = createCanvasStateUtils(setCanvasState);

	return (
		<CanvasStateContext.Provider
			value={{
				canvasState,
				canvasStateUtils,
			}}
		>
			{children}
		</CanvasStateContext.Provider>
	);
};
