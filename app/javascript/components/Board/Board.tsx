import React, { useEffect, useRef } from "react";
import MemberMenu from "./MemberMenu/MemberMenu.js";
import ToolBar from "./ToolBar/ToolBar.js";
import BoardMenu from "./BoardMenu/BoardMenu.js";
import ResourcesMenu from "./ResourcesMenu/ResourcesMenu.js";
import { useState } from "react";
import { CanvasMode, CanvasState } from "../../Types/Canvas.js";
import Canvas from "./Canvas/Canvas.js";
import UseObjectsInteraction from "../../hooks/Board/Canvas/Objects/UseObjectsInteraction.js";
import UseStageScaleAndPosition from "../../hooks/Board/Canvas/UseStageScaleAndPosition.js";
import UseHistory from "../../hooks/Board/UseHistory.js";
import UseCanvasContentQuery from "../../hooks/Board/Canvas/UseCanvasContentQuery.js";
import Loader from "../General/Loader.js";
import createCanvasStateUtils from "../../scripts/canvasStateUtils/createCanvasStateUtils.js";
import UseCurrentMemberQuery from "../../hooks/Board/Members/UseCurrentMemberQuery.js";
import { Toaster } from "@/shadcn/components/ui/sonner.js";
import CriticalError from "../General/CriticalError.js";
import { useTranslation } from "react-i18next";
import UseBoardQuery from "@/hooks/Board/Board/UseBoardQuery.js";

function Board() {
	const {
		board,
		refetch: refetchBoard,
		isLoading: isBoardLoading,
		error: boardError,
		isError: isBoardError,
	} = UseBoardQuery();

	const { t } = useTranslation();
	const [canvasState, setCanvasState] = useState<CanvasState>({
		mode: CanvasMode.None,
	});
	const canvasStateUtils = createCanvasStateUtils(setCanvasState);

	const {
		currentMember,
		refetch: refetchCurrentMember,
		isLoading: isMemberLoading,
		error: currentMemberError,
		isError: isCurrentMemberError,
	} = UseCurrentMemberQuery();

	const useStageScaleAndPosition = UseStageScaleAndPosition();
	const { stageScale } = useStageScaleAndPosition;

	const changeObjects = useRef(() => {});

	const {
		historyHandleChanges,
		undo,
		canUndo,
		redo,
		canRedo,
		removeAdditionalDelay: removeAdditionalHistoryDelay,
		unsavedChanges,
		isContentMutationError,
		contentMutationError,
	} = UseHistory({
		changeObjects,
	});

	const { canvasObjects, setCanvasObjects, canvasUseObjectsInteraction, resourcesProperties } = UseObjectsInteraction(
		{
			blocked: !currentMember?.role?.can_edit,
			canvasState,
			canvasStateUtils,
			stageScale,
			handleHistory: {
				changeObjects,
				historyHandleChanges,
				removeAdditionalHistoryDelay,
			},
		},
	);

	const {
		isLoading: contentIsLoading,
		error: contentQueryError,
		isError: isContentQueryError,
	} = UseCanvasContentQuery({ canvasStateUtils, setCanvasObjects, isContentMutationError });

	const [criticalError, setCriticalError] = useState<null | {
		message: string;
		when: string;
	}>(null);
	useEffect(() => {
		if (isCurrentMemberError) {
			setCriticalError({
				message: currentMemberError?.message,
				when: t("board.critical_error.when.loading_member"),
			});
		} else if (isContentQueryError) {
			setCriticalError({
				message: contentQueryError?.message,
				when: t("board.critical_error.when.loading_content"),
			});
		} else if (isContentMutationError) {
			setCriticalError({
				message: contentMutationError?.message,
				when: t("board.critical_error.when.saving_content"),
			});
		} else if (isBoardError) {
			setCriticalError({
				message: boardError?.message,
				when: t("board.critical_error.when.loading_board"),
			});
		}
	}, [isCurrentMemberError, isContentQueryError, isContentMutationError, isBoardError]);

	if (contentIsLoading || isMemberLoading || !currentMember || isBoardLoading) {
		return <Loader />;
	}

	return (
		<div>
			<Canvas
				objectsBlocked={!currentMember?.role?.can_edit}
				canvasState={canvasState}
				canvasStateUtils={canvasStateUtils}
				canvasObjects={canvasObjects}
				canvasUseObjects={canvasUseObjectsInteraction}
				canvasStageScaleAndPosition={useStageScaleAndPosition}
			/>

			<BoardMenu
				refetchBoard={refetchBoard}
				showSaving={currentMember?.role?.can_edit}
				board={board}
				unsavedChanges={unsavedChanges}
				modifiable={currentMember?.role?.name === "Owner"}
			/>

			{currentMember?.role?.can_edit && (
				<>
					<ToolBar
						canvasState={canvasState}
						canvasStateUtils={canvasStateUtils}
						undo={undo}
						redo={redo}
						canUndo={canUndo()}
						canRedo={canRedo()}
					/>
					<ResourcesMenu
						canvasState={canvasState}
						canvasStateUtils={canvasStateUtils}
						resourcesProperties={resourcesProperties}
					/>
				</>
			)}

			<MemberMenu currentMember={currentMember} refetchCurrentMember={refetchCurrentMember} />

			<Toaster expand position="top-center" richColors theme="light" />

			{criticalError && <CriticalError when={criticalError.when} message={criticalError.message} />}
		</div>
	);
}

export default Board;
