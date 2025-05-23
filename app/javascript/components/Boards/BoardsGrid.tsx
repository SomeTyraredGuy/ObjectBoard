import ROUTES from "@/routes";
import { Button } from "@/shadcn/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shadcn/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/components/ui/popover";
import { Board } from "@/Types/Board";
import React from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import ConfirmationDialog from "../General/ConfirmationDialog";
import { showConfirmation } from "@/components/Boards/Tabs/BoardsTab";

type Props = {
	boards: Board[];
	className?: string;
	acceptInvite?: () => void;
	setAcceptedBoardId?: React.Dispatch<React.SetStateAction<number | null>>;
	declineInvite?: () => void;
	leaveBoard?: () => void;
	deleteBoard?: () => void;
	showConfirmation: showConfirmation;
	setShowConfirmation: React.Dispatch<React.SetStateAction<showConfirmation>>;
};

function BoardsGrid({
	boards = [],
	className,
	acceptInvite,
	setAcceptedBoardId,
	declineInvite,
	leaveBoard,
	deleteBoard,
	showConfirmation,
	setShowConfirmation,
}: Props) {
	const { t } = useTranslation();

	const buttonLabel = (role: string) =>
		role === "Owner" ? t("board.delete") : leaveBoard ? t("board.leave") : t("common.actions.decline");

	return (
		<div className={`grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}>
			{boards.map((board) => (
				<Card key={board.id} className="content-around">
					<CardHeader>
						<CardTitle className="truncate">{board.name}</CardTitle>
						<CardDescription>{t("board.members_menu.role." + board.role)}</CardDescription>
					</CardHeader>
					<CardContent className="h-full">
						<Popover>
							<PopoverTrigger asChild>
								<CardDescription className="line-clamp-2 cursor-pointer">
									{board.description}
								</CardDescription>
							</PopoverTrigger>
							<PopoverContent className="w-80">
								<p>{board.description}</p>
							</PopoverContent>
						</Popover>
					</CardContent>
					<CardFooter className="flex gap-2">
						<div className="flex w-full justify-between gap-2">
							<Button
								variant="outline"
								size="sm"
								className="w-9/20"
								asChild={!acceptInvite}
								onClick={setAcceptedBoardId ? () => setAcceptedBoardId(board.id) : undefined}
							>
								{acceptInvite ? (
									t("common.actions.accept")
								) : (
									<Link to={ROUTES.board(board.id)}>{t("board.open")}</Link>
								)}
							</Button>
							<Button
								variant="destructive"
								size="sm"
								className="w-9/20"
								onClick={() =>
									setShowConfirmation({
										action: board.role === "Owner" ? deleteBoard : leaveBoard || declineInvite,
										boardId: board.id,
										label: buttonLabel(board.role),
									})
								}
							>
								{buttonLabel(board.role)}
							</Button>
						</div>
					</CardFooter>
				</Card>
			))}
			<ConfirmationDialog
				isOpen={!!showConfirmation}
				onOpenChange={() => setShowConfirmation(null)}
				action={() => {
					showConfirmation.action();
				}}
				isPending={false}
				button_label={showConfirmation?.label}
			/>
		</div>
	);
}

export default BoardsGrid;
