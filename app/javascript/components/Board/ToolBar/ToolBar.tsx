import React from "react";
import classes from "./toolBar.module.css";
import { SelectSVG, UndoSVG, RedoSVG, TextSVG, RectangleSVG, CircleSVG, ArrowSVG } from "../../svg/ToolsSVG";
import IconButton from "../../General/IconButton";
import { CanvasMode, CanvasState, Side } from "../../../Types/Canvas";
import { CanvasObjectType } from "../../../Types/CanvasObjects";
import UseDefaultObjects from "../../../hooks/Board/Canvas/Objects/UseDefaultObjects";
import { CanvasStateUtils } from "../../../Types/CanvasStateUtils";

type Props = {
	canvasState: CanvasState;
	canvasStateUtils: CanvasStateUtils;
	undo: () => void;
	redo: () => void;
	canUndo: boolean;
	canRedo: boolean;
};

function ToolBar({ canvasState, canvasStateUtils, undo, redo, canUndo, canRedo }: Props) {
	const { defaultRectangle, defaultEllipse, defaultText, defaultLine } = UseDefaultObjects();

	const switchButtons = [
		{
			icon: SelectSVG,
			onClick: () => {
				canvasStateUtils.None.set();
			},
			label: "Select",
			isActive: canvasState.mode !== CanvasMode.Inserting,
		},
		{
			icon: TextSVG,
			onClick: () => {
				canvasStateUtils.Inserting.set(defaultText());
			},
			label: "Text",
			isActive:
				canvasState.mode === CanvasMode.Inserting && canvasState.startingProperties.type === CanvasObjectType.Text,
		},
		{
			icon: RectangleSVG,
			onClick: () => {
				canvasStateUtils.Inserting.set(defaultRectangle());
			},
			label: "Rectangle",
			isActive:
				canvasState.mode === CanvasMode.Inserting && canvasState.startingProperties.type === CanvasObjectType.Rectangle,
		},
		{
			icon: CircleSVG,
			onClick: () => {
				canvasStateUtils.Inserting.set(defaultEllipse());
			},
			label: "Ellipse",
			isActive:
				canvasState.mode === CanvasMode.Inserting && canvasState.startingProperties.type === CanvasObjectType.Ellipse,
		},
		{
			icon: ArrowSVG,
			onClick: () => {
				canvasStateUtils.Inserting.set(defaultLine());
			},
			label: "Line",
			isActive:
				canvasState.mode === CanvasMode.Inserting && canvasState.startingProperties.type === CanvasObjectType.Line,
		},
	];

	const actionButtons = [
		{
			icon: UndoSVG,
			onClick: undo,
			label: "Undo",
			isDisabled: !canUndo,
		},
		{
			icon: RedoSVG,
			onClick: redo,
			label: "Redo",
			isDisabled: !canRedo,
		},
	];

	return (
		<div className={`${classes.wrapper}`} role="group" aria-label="Vertical radio toggle button group">
			<div className={`${classes.section}`}>
				{switchButtons.map((button, i) => (
					<IconButton
						key={i}
						icon={button.icon}
						onClick={button.onClick}
						label={button.label}
						isDisabled={false}
						isActive={button.isActive}
						href={null}
						side={Side.Right}
					/>
				))}
			</div>

			<div className={`${classes.section}`}>
				{actionButtons.map((button, i) => (
					<IconButton
						key={i}
						icon={button.icon}
						onClick={button.onClick}
						label={button.label}
						isDisabled={button.isDisabled}
						isActive={null}
						href={null}
						side={Side.Right}
					/>
				))}
			</div>
		</div>
	);
}

export default ToolBar;
