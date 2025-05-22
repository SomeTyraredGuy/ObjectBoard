import React, { useState } from "react";
import { UndoSVG } from "../../svg/ToolsSVG";
import SavingIcon from "../SavingIcon";
import Hint from "@/components/General/Hint/Hint";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import ShowBoard from "./ShowBoard";
import ROUTES from "@/routes";

type Props = {
	board: {
		name: string;
		description: string;
	};
	unsavedChanges: boolean;
	showSaving: boolean;
	refetchBoard: () => void;
	modifiable: boolean;
};

function BoardMenu({ board, unsavedChanges, showSaving, refetchBoard, modifiable }: Props) {
	const { t } = useTranslation("translation", { keyPrefix: "board.board_menu" });
	const [showBoard, setShowBoard] = useState(false);
	function toggleShowBoard() {
		setShowBoard(!showBoard);
	}

	return (
		<table className="w-2xs fixed top-0 m-2">
			<tbody className="w-100">
				<tr className="flex h-16 justify-end">
					<th className="bg-background hover:bg-primary border-standard flex items-center rounded-l-2xl !border-r-0 p-0">
						<Hint title={t("exit")} side="bottom" asChild>
							<Link
								to={ROUTES.boards()}
								className="hover:text-secondary flex h-full w-12 items-center justify-center"
							>
								<UndoSVG className="h-6 w-6" />
							</Link>
						</Hint>
					</th>
					<th
						className={`flex-grow-1 button-hover border-standard bg-background flex w-48 border-s-0 p-0 ${showSaving ? "" : "rounded-r-2xl"}`}
					>
						<button
							onClick={toggleShowBoard}
							className="flex-grow-1 content-center truncate p-2 text-center"
						>
							{board.name}
						</button>
					</th>
					{showSaving && (
						<th
							className="border-standard bg-background content-center rounded-r-2xl !border-l-0 p-2"
							role="status"
						>
							<SavingIcon unsavedChanges={unsavedChanges} />
						</th>
					)}
				</tr>
			</tbody>
			<ShowBoard
				open={showBoard}
				closeFn={toggleShowBoard}
				board={board}
				modifiable={modifiable}
				refetchBoard={refetchBoard}
			/>
		</table>
	);
}

export default BoardMenu;
