import React from "react";
import { UndoSVG } from "../../svg/ToolsSVG";
import SavingIcon from "../SavingIcon";
import Hint from "@/components/General/Hint/Hint";
import { useTranslation } from "react-i18next";
import getMeta from "@/scripts/getMeta";

type Props = {
	boardName: string;
	unsavedChanges: boolean;
	showSaving: boolean;
};

function BoardMenu({ boardName, unsavedChanges, showSaving }: Props) {
	const { t } = useTranslation("translation", { keyPrefix: "board.board_menu" });
	return (
		<table className="w-2xs fixed top-0 m-2">
			<tbody className="w-100">
				<tr className="flex h-16 justify-end">
					<th className="bg-background hover:bg-primary border-standard flex items-center rounded-l-2xl !border-r-0 p-0">
						<Hint
							title={t("exit")}
							side="bottom"
							href={`/${getMeta("locale")}/boards`}
							className="hover:text-secondary flex h-full w-12 items-center justify-center"
						>
							<UndoSVG className="h-6 w-6" />
						</Hint>
					</th>
					<th
						className={`flex-grow-1 border-standard bg-background w-48 content-center truncate border-s-0 p-2 text-center ${showSaving ? "" : "rounded-r-2xl"}`}
					>
						{boardName}
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
		</table>
	);
}

export default BoardMenu;
