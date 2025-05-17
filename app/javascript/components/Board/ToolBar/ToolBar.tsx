import React from "react";
import { SelectSVG, UndoSVG, RedoSVG, TextSVG, RectangleSVG, CircleSVG, ArrowSVG } from "../../svg/ToolsSVG";
import IconButton from "../../General/IconButton";
import { CanvasMode, CanvasState } from "../../../Types/Canvas";
import { CanvasObjectType } from "../../../Types/CanvasObjects";
import UseDefaultObjects from "../../../hooks/Board/Canvas/Objects/UseDefaultObjects";
import { CanvasStateUtils } from "../../../Types/CanvasStateUtils";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/General/LanguageSwitcher";

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
	const { t } = useTranslation("translation", { keyPrefix: "board.toolbar" });

	const switchButtons = [
		{
			icon: SelectSVG,
			onClick: () => {
				canvasStateUtils.None.set();
			},
			label: t("select"),
			isActive: canvasState.mode !== CanvasMode.Inserting,
		},
		{
			icon: TextSVG,
			onClick: () => {
				canvasStateUtils.Inserting.set(defaultText());
			},
			label: t("text"),
			isActive:
				canvasState.mode === CanvasMode.Inserting &&
				canvasState.startingProperties.type === CanvasObjectType.Text,
		},
		{
			icon: RectangleSVG,
			onClick: () => {
				canvasStateUtils.Inserting.set(defaultRectangle());
			},
			label: t("rectangle"),
			isActive:
				canvasState.mode === CanvasMode.Inserting &&
				canvasState.startingProperties.type === CanvasObjectType.Rectangle,
		},
		{
			icon: CircleSVG,
			onClick: () => {
				canvasStateUtils.Inserting.set(defaultEllipse());
			},
			label: t("ellipse"),
			isActive:
				canvasState.mode === CanvasMode.Inserting &&
				canvasState.startingProperties.type === CanvasObjectType.Ellipse,
		},
		{
			icon: ArrowSVG,
			onClick: () => {
				canvasStateUtils.Inserting.set(defaultLine());
			},
			label: t("line"),
			isActive:
				canvasState.mode === CanvasMode.Inserting &&
				canvasState.startingProperties.type === CanvasObjectType.Line,
		},
	];

	const actionButtons = [
		{
			icon: UndoSVG,
			onClick: undo,
			label: t("undo"),
			isDisabled: !canUndo,
		},
		{
			icon: RedoSVG,
			onClick: redo,
			label: t("redo"),
			isDisabled: !canRedo,
		},
	];

	const sectionClassName =
		"bg-background border-standard my-2.5 flex w-14 flex-col items-center self-center rounded-r-2xl px-1 py-2";

	return (
		<div className="fixed left-0 top-1/2 -translate-y-1/2">
			<div className={sectionClassName}>
				{switchButtons.map((button, i) => (
					<IconButton
						key={i}
						icon={button.icon}
						onClick={button.onClick}
						label={button.label}
						isActive={button.isActive}
						side="right"
						className="my-1 h-10 w-10"
					/>
				))}
			</div>

			<div className={sectionClassName}>
				{actionButtons.map((button, i) => (
					<IconButton
						key={i}
						icon={button.icon}
						onClick={button.onClick}
						label={button.label}
						isDisabled={button.isDisabled}
						side="right"
						className="my-1 h-10 w-10"
					/>
				))}
			</div>

			<div className={sectionClassName}>
				<LanguageSwitcher side="right" className="my-1 h-10 w-10" />
			</div>
		</div>
	);
}

export default ToolBar;
