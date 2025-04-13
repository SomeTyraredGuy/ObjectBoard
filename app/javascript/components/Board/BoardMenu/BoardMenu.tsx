import React from "react";
import classes from "../board.module.css";
import generalClasses from "../../General/general.module.css";
import IconButton from "../../General/IconButton";
import { UndoSVG } from "../../svg/ToolsSVG";
import { Side } from "../../../Types/Canvas";
import SavingIcon from "../../General/SavingIcon";

type Props = {
	boardName: string;
	unsavedChanges: boolean;
	showSaving: boolean;
};

function BoardMenu({ boardName, unsavedChanges, showSaving }: Props) {
	return (
		<table className="m-2 position-fixed top-0 " style={{ width: "280px" }}>
			<tbody className="w-100">
				<tr className="d-flex justify-content-end">
					<th className={`${classes.leftBorder} ${classes.leftRounded} ${classes.background} p-2`}>
						<IconButton icon={UndoSVG} label={"Exit board"} side={Side.Right} href="/boards" />
					</th>
					<th
						className={`flex-grow-1 p-2 text-center align-content-center border-start-0 
						${classes.ellipsis} ${classes.background} ${classes.border}
						${showSaving ? "" : classes.rightRounded}`}
					>
						{boardName}
					</th>
					{showSaving && (
						<th
							className={`${classes.rightBorder} ${classes.rightRounded} ${classes.background} p-2 align-content-center ${generalClasses.hintWrapper}`}
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
