import React from "react";
import { useState } from "react";
import classes from "../../board.module.css";
import MemberSettings from "../MemberSettings";
import { CurrentMember } from "../../../../Types/Member";

type Props = {
	currentMember: CurrentMember;
	refetchCurrentMember: () => void;
};

function CurrentMemberButton({ currentMember, refetchCurrentMember }: Props) {
	const [showMenu, setShowMenu] = useState(false);

	function toggleMenu() {
		setShowMenu(!showMenu);
	}

	return (
		<div>
			<button
				onClick={toggleMenu}
				className={`p-2 d-flex flex-row border-0 align-items-center w-100 ${classes.leftRounded} ${classes.buttonHover}`}
			>
				<img
					className="rounded-circle"
					src={`${currentMember.avatar}`}
					alt="Current user avatar"
					style={{ width: "42px", height: "42px" }}
				/>
				<span className={`text-start mx-2 ${classes.ellipsis}`}>
					<strong>{currentMember.name}</strong>
					<br />
					Role: {currentMember.role.name}
				</span>
			</button>
			{showMenu && (
				<MemberSettings
					currentMember={currentMember}
					member={currentMember}
					closeFn={toggleMenu}
					refetchFn={refetchCurrentMember}
				/>
			)}
		</div>
	);
}

export default CurrentMemberButton;
