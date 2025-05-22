import React, { useState } from "react";
import CurrentMemberButton from "./CurrentMember/CurrentMemberButton";
import { CurrentMember, OtherMember } from "@/Types/Member";
import OtherMembersDropdown from "./OtherMembers/OtherMembersDropdown";
import MemberSettings from "./Settings/MemberSettings";
import UseCustomQuery from "@/hooks/UseCustomQuery";
import AddMemberForm from "./OtherMembers/AddMemberForm";
import useNotification from "@/hooks/useNotification";
import ROUTES from "@/routes";

type Props = {
	currentMember: CurrentMember;
	refetchCurrentMember: () => void;
};

function MemberMenu({ currentMember, refetchCurrentMember }: Props) {
	const {
		data: otherMembers = [],
		isError,
		error,
		refetch,
	} = UseCustomQuery({
		queryKey: ["other_members"],
		path: ROUTES.otherMembersApi(),
	});

	useNotification({
		isError,
		error,
	});

	const [chosenMember, setChosenMember] = useState<OtherMember | null>(null);
	function toggleMemberMenu(member = null) {
		if (chosenMember === null && member !== null) setChosenMember(member);
		else setChosenMember(null);
	}

	const [showAddMemberMenu, setShowAddMemberMenu] = useState(false);
	function toggleAddMemberMenu() {
		setShowAddMemberMenu(!showAddMemberMenu);
	}

	return (
		<div>
			<table className="fixed end-0 top-0 m-2">
				<tbody className="w-full">
					<tr className="flex h-16 items-center justify-end">
						<th className="border-standard bg-background button-hover h-full w-56 rounded-l-2xl">
							<CurrentMemberButton currentMember={currentMember} toggleMemberMenu={toggleMemberMenu} />
						</th>
						<th className="border-standard bg-background button-hover h-full w-16 rounded-r-2xl !border-l-0">
							<OtherMembersDropdown
								currentMember={currentMember}
								otherMembers={otherMembers}
								toggleMemberMenu={toggleMemberMenu}
								toggleAddMemberMenu={toggleAddMemberMenu}
							/>
						</th>
					</tr>
				</tbody>
			</table>
			{!!chosenMember && (
				<MemberSettings
					closeFn={toggleMemberMenu}
					currentMember={currentMember}
					member={chosenMember}
					refetchFn={chosenMember === currentMember ? refetchCurrentMember : refetch}
				/>
			)}
			<AddMemberForm refetchFn={refetch} closeFn={toggleAddMemberMenu} open={showAddMemberMenu} />
		</div>
	);
}

export default MemberMenu;
