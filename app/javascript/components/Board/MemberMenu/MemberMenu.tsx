import React from "react";
import classes from "../board.module.css";
import CurrentMemberButton from "./CurrentMember/CurrentMemberButton";
import OtherMembersButton from "./OtherMembers/OtherMembersButton";
import { CurrentMember } from "../../../Types/Member";

type Props = {
	currentMember: CurrentMember;
	refetchCurrentMember: () => void;
	isLoading?: boolean;
};

function MemberMenu({ currentMember, refetchCurrentMember, isLoading }: Props) {
	return (
		<table className={`m-2 position-fixed top-0 end-0 ${isLoading && "placeholder-wave"}`} style={{ height: "70px" }}>
			{isLoading ? (
				<tbody className="placeholder col-12 bg-secondary"></tbody>
			) : (
				<tbody className="w-100">
					<tr className="align-items-center d-flex justify-content-end">
						<th
							className={`${classes.leftBorder} ${classes.leftRounded} ${classes.background}`}
							style={{ width: "216px" }}
						>
							<CurrentMemberButton currentMember={currentMember} refetchCurrentMember={refetchCurrentMember} />
						</th>
						<th
							className={`${classes.rightBorder} ${classes.rightRounded} ${classes.background}`}
							style={{ width: "64px" }}
						>
							<OtherMembersButton currentMember={currentMember} />
						</th>
					</tr>
				</tbody>
			)}
		</table>
	);
}

export default MemberMenu;
