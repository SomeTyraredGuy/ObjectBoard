import React from "react";
import classes from "../../board.module.css";
import generalClasses from "../../../General/general.module.css";
import PlusCircleSVG from "../../../svg/PlusCircleSVG.js";
import Notification from "../../../General/Notification/Notification";
import MemberListItem from "./MemberListItem";
import MemberSettings from "../MemberSettings";
import { useState } from "react";
import AddMemberForm from "./AddMemberForm.js";
import { CurrentMember } from "../../../../Types/Member";
import UseOtherMembersQuery from "../../../../hooks/Board/Members/UseOtherMembersQuery";

type Props = {
	currentMember: CurrentMember;
};

function OtherMembersButton({ currentMember }: Props) {
	const [chosenMember, setChosenMember] = useState(null);
	const [showAddMemberMenu, setShowAddMemberMenu] = useState(false);

	function toggleMemberMenu(member = null) {
		if (chosenMember === null && member !== null) setChosenMember(member);
		else setChosenMember(null);
	}

	function toggleAddMemberMenu() {
		setShowAddMemberMenu(!showAddMemberMenu);
	}

	const { otherMembers, isError, error, refetch } = UseOtherMembersQuery();

	function buttonFunction() {
		if (noOtherMembers()) {
			return toggleAddMemberMenu;
		}
	}

	function noOtherMembers() {
		return otherMembers === undefined || otherMembers.length === 0;
	}

	function buttonHover() {
		if (!(!currentMember.role.can_change_roles && noOtherMembers())) return classes.buttonHover;
		else return "";
	}

	return (
		<div className="dropdown">
			<button
				type="button"
				id="dropdownMenuButton1"
				data-bs-toggle={`${!noOtherMembers() && "dropdown"}`}
				aria-expanded="false"
				className={`w-100 border-0 d-flex ${classes.rightRounded} ${buttonHover()} ${
					noOtherMembers() && "justify-content-center align-items-center"
				}`}
				style={{ width: "66px", height: "64px" }}
				onClick={buttonFunction()}
				disabled={!currentMember.role.can_change_roles && noOtherMembers()}
			>
				{noOtherMembers() ? (
					<PlusCircleSVG />
				) : (
					otherMembers
						.slice(0, 3)
						.map((member, i) => (
							<img
								className={`rounded-circle ${classes.avatarCard}`}
								key={i}
								src={`${member.avatar}`}
								alt="Current user avatar"
							/>
						))
				)}
			</button>

			<ul
				className={`dropdown-menu p-0 ${classes.border} ${generalClasses.scroll}`}
				style={{ width: "272px", maxHeight: "80vh" }}
				aria-labelledby="dropdownMenuButton1"
			>
				{otherMembers !== undefined &&
					otherMembers.map((member, i) => (
						<MemberListItem
							member={member}
							toggleMenu={toggleMemberMenu}
							key={i}
							disabledButton={!currentMember.role.can_change_roles}
						/>
					))}

				{currentMember.role.can_change_roles && (
					<li>
						<a
							className="dropdown-item p-2 d-flex flex-row justify-content-between align-items-center"
							onClick={() => setShowAddMemberMenu(!showAddMemberMenu)}
						>
							<PlusCircleSVG />
							<span className="text-center flex-grow-1">Add new member</span>
						</a>
					</li>
				)}
			</ul>

			<Notification trigger={isError} title={"Error fetching other users"} message={error?.message} type={"error"} />
			{chosenMember !== null && (
				<MemberSettings
					currentMember={currentMember}
					member={chosenMember}
					closeFn={toggleMemberMenu}
					refetchFn={refetch}
				/>
			)}
			{showAddMemberMenu && <AddMemberForm closeFn={toggleAddMemberMenu} refetchFn={refetch} />}
		</div>
	);
}

export default OtherMembersButton;
