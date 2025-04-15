import React, { useRef } from "react";
import MemberMenu from "./MemberMenu/MemberMenu.js";
import Notification from "../General/Notification/Notification.jsx";
import ToolBar from "./ToolBar/ToolBar.jsx";
import BoardMenu from "./BoardMenu/BoardMenu.jsx";
import ResourcesMenu from "./ResourcesMenu/ResourcesMenu.jsx";
import { useState } from "react";
import { CanvasMode, CanvasState } from "../../Types/Canvas";
import Canvas from "./Canvas/Canvas.js";
import UseObjectsInteraction from "../../hooks/Board/Canvas/Objects/UseObjectsInteraction.js";
import UseStageScaleAndPosition from "../../hooks/Board/Canvas/UseStageScaleAndPosition.js";
import UseHistory from "../../hooks/Board/UseHistory.js";
import UseCanvasContentQuery from "../../hooks/Board/Canvas/UseCanvasContentQuery.js";
import Loader from "../General/Loader/Loader.js";
import createCanvasStateUtils from "../../scripts/canvasStateUtils/createCanvasStateUtils.js";
import UseCurrentMemberQuery from "../../hooks/Board/Members/UseCurrentMemberQuery.js";

export type IndexProps = {
	db: {
		boardName: string;
	};
};

function Index({ db }: IndexProps) {
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

	const { canvasObjects, setCanvasObjects, canvasUseObjectsInteraction, resourcesProperties } = UseObjectsInteraction({
		blocked: !currentMember?.role?.can_edit,
		canvasState,
		canvasStateUtils,
		stageScale,
		handleHistory: {
			changeObjects,
			historyHandleChanges,
			removeAdditionalHistoryDelay,
		},
	});

	const {
		isLoading: contentIsLoading,
		error: contentQueryError,
		isError: isContentQueryError,
	} = UseCanvasContentQuery({ canvasStateUtils, setCanvasObjects, isContentMutationError });

	const notifications = [
		{
			trigger: isCurrentMemberError,
			message: currentMemberError?.message,
			title: "Error loading user",
		},
		{
			trigger: isContentQueryError,
			message: contentQueryError?.message,
			title: "Error loading content",
		},
		{
			trigger: isContentMutationError,
			message: contentMutationError?.message,
			title: "Error saving content",
		},
	];

	if (contentIsLoading || isMemberLoading || !currentMember) {
		return <Loader />;
	}

	return (
		<div data-theme="light">
			<Canvas
				objectsBlocked={!currentMember?.role?.can_edit}
				canvasState={canvasState}
				canvasStateUtils={canvasStateUtils}
				canvasObjects={canvasObjects}
				canvasUseObjects={canvasUseObjectsInteraction}
				canvasStageScaleAndPosition={useStageScaleAndPosition}
			/>

			<BoardMenu showSaving={currentMember?.role?.can_edit} boardName={db.boardName} unsavedChanges={unsavedChanges} />

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

			{notifications.map((notification, index) => (
				<Notification
					key={index}
					trigger={notification.trigger}
					title={notification.title}
					message={notification.message}
					type={"error"}
					reloadPage={true}
				/>
			))}
		</div>
	);
}

export default Index;
