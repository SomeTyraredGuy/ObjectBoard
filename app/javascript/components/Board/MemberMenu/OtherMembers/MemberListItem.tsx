import React from "react";
import classes from "../board.module.css";
import { OtherMember } from "../../../../Types/Member";

type Props = {
	member: OtherMember;
	toggleMenu: (member: OtherMember) => void;
	disabledButton: boolean;
};

function MemberListItem({ member, toggleMenu, disabledButton }: Props) {
	return (
		<li
			className={`d-flex flex-row justify-content-between align-items-center text-center ${classes.bottomBorder}`}
			key={member.user_id}
		>
			<img
				src={member.avatar}
				alt="Avatar"
				className="rounded-circle m-2"
				style={{ width: "42px", height: "42px", minWidth: "42px" }}
			/>
			<span className={`${classes.ellipsis}`}>{member.name}</span>
			<button className="dropdown-item w-25" onClick={() => toggleMenu(member)} disabled={disabledButton}>
				<span className="text-center">
					Role:
					<br />
					{member.role.name}
				</span>
			</button>
		</li>
	);
}

export default MemberListItem;
