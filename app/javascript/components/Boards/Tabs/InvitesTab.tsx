import { TabsContent } from "@/shadcn/components/ui/tabs";
import { Board } from "@/Types/Board";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BoardsGrid from "../BoardsGrid";
import UseCustomMutation from "@/hooks/UseCustomMutation";
import { showConfirmation } from "@/components/Boards/Tabs/BoardsTab";
import ROUTES from "@/routes";

type Props = {
	boards: Board[];
	refetchBoards: () => void;
	isLoading: boolean;
	onNavigateToTab: (tabValue: string) => void;
};

function InvitesTab({ boards, refetchBoards, isLoading }: Props) {
	const { t } = useTranslation();

	const invitedBoards = boards.filter((board) => board.role === "Invited");

	const [showConfirmation, setShowConfirmation] = useState<showConfirmation>(null);
	const [acceptedBoardId, setAcceptedBoardId] = useState<number | null>(null);

	const { mutate: acceptInvite } = UseCustomMutation({
		path: ROUTES.acceptInviteApi(acceptedBoardId),
		method: "POST",
		onSuccess: refetchBoards,
		successMessage: t("board.successfully_accepted_invite"),
	});

	useEffect(() => {
		if (acceptedBoardId === null) return;

		acceptInvite({});
		setAcceptedBoardId(null);
	}, [acceptedBoardId]);

	const { mutate: declineInvite } = UseCustomMutation({
		path: ROUTES.leaveBoardApi(showConfirmation?.boardId),
		method: "DELETE",
		onSuccess: refetchBoards,
		successMessage: t("board.successfully_declined_invite"),
	});

	return (
		<TabsContent value="invites">
			<div className="mb-4 items-start sm:items-center">
				<h1 className="text-2xl font-semibold tracking-tight">{t("board.invites.label")}</h1>
			</div>

			{isLoading && (
				<div className="flex h-40 items-center justify-center">
					<p>{t("common.loading")}</p>
				</div>
			)}

			{!isLoading && invitedBoards.length === 0 ? (
				<div className="flex h-40 items-center justify-center">
					<p>{t("board.invites.no_invites")}</p>
				</div>
			) : (
				<BoardsGrid
					boards={invitedBoards}
					className="border-border/50 rounded-2xl border p-5"
					acceptInvite={() => {}}
					setAcceptedBoardId={setAcceptedBoardId}
					declineInvite={() => declineInvite({})}
					showConfirmation={showConfirmation}
					setShowConfirmation={setShowConfirmation}
				/>
			)}
		</TabsContent>
	);
}

export default InvitesTab;
