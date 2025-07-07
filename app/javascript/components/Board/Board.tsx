import React, { useEffect, useRef } from "react";
import MemberMenu from "./MemberMenu/MemberMenu.js";
import ToolBar from "./ToolBar/ToolBar.js";
import BoardMenu from "./BoardMenu/BoardMenu.js";
import ResourcesMenu from "./ResourcesMenu/ResourcesMenu.js";
import { useState } from "react";
import Canvas from "./Canvas/Canvas.js";
import UseObjectsInteraction from "../../hooks/Board/Canvas/Objects/UseObjectsInteraction.js";
import UseStageScaleAndPosition from "../../hooks/Board/Canvas/UseStageScaleAndPosition.js";
import UseHistory from "../../hooks/Board/UseHistory.js";
import UseBoardContentQuery from "../../hooks/Board/Canvas/UseBoardContentQuery.js";
import Loader from "../General/Loader.js";
import UseCustomQuery from "@/hooks/UseCustomQuery";
import CriticalError from "../General/CriticalError.js";
import { useTranslation } from "react-i18next";
import ROUTES from "@/routes.js";
import { useNavigate } from "react-router";
import UseExport from "@/hooks/Board/Canvas/UseExport.js";

function Board() {
	const {
		data: board,
		refetch: refetchBoard,
		isLoading: isBoardLoading,
		isError: isBoardError,
	} = UseCustomQuery({
		queryKey: ["board"],
		path: ROUTES.getOneBoardApi(),
		disableNotification: true,
	});

	const navigate = useNavigate();
	useEffect(() => {
		if (isBoardError) {
			navigate(ROUTES.home());
		}
	}, [isBoardError]);

	const { t } = useTranslation();

	const {
		data: currentMember,
		refetch: refetchCurrentMember,
		isLoading: isMemberLoading,
		error: currentMemberError,
		isError: isCurrentMemberError,
	} = UseCustomQuery({
		queryKey: ["current_member"],
		path: ROUTES.currentMemberApi(),
		disableNotification: true,
	});

	const useStageScaleAndPosition = UseStageScaleAndPosition();
	const { stageScale, stagePosition } = useStageScaleAndPosition;
	const { handleExport, stageRef, objectsLayerRef } = UseExport({
		stageScale,
		stagePosition,
	});

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
	} = UseBoardContentQuery({ setCanvasObjects, isContentMutationError });

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
		}
	}, [isCurrentMemberError, isContentQueryError, isContentMutationError]);

	if (contentIsLoading || isMemberLoading || !currentMember || isBoardLoading) {
		return <Loader />;
	}

	return (
		<div className="h-screen w-screen overflow-hidden">
			<Canvas
				objectsBlocked={!currentMember?.role?.can_edit}
				canvasObjects={canvasObjects}
				canvasUseObjects={canvasUseObjectsInteraction}
				canvasStageScaleAndPosition={useStageScaleAndPosition}
				stageRef={stageRef}
				objectsLayerRef={objectsLayerRef}
			/>

			<BoardMenu
				refetchBoard={refetchBoard}
				showSaving={currentMember?.role?.can_edit}
				board={board}
				unsavedChanges={unsavedChanges}
				modifiable={currentMember?.role?.name === "Owner"}
			/>

			<ToolBar
				undo={undo}
				redo={redo}
				canUndo={canUndo()}
				canRedo={canRedo()}
				handleExport={handleExport}
				canEdit={currentMember?.role?.can_edit}
			/>

			{currentMember?.role?.can_edit && <ResourcesMenu resourcesProperties={resourcesProperties} />}

			<MemberMenu currentMember={currentMember} refetchCurrentMember={refetchCurrentMember} />

			{criticalError && <CriticalError when={criticalError.when} message={criticalError.message} />}
		</div>
	);
}

export default Board;
