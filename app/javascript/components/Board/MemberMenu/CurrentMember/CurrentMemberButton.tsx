import React from "react";
import { CurrentMember } from "../../../../Types/Member";

type Props = {
	currentMember: CurrentMember;
	toggleMemberMenu: (member: CurrentMember | null) => void;
};

function CurrentMemberButton({ currentMember, toggleMemberMenu }: Props) {
	return (
		<div>
			<button
				onClick={() => toggleMemberMenu(currentMember)}
				className="flex w-full flex-row items-center rounded-l-2xl border-0 p-2"
			>
				<img className="h-12 w-12 rounded-full" src={currentMember.avatar} alt="Current user avatar" />
				<span className="mx-2 truncate text-start">
					{currentMember.name}
					<br />
					Role: {currentMember.role.name}
				</span>
			</button>
		</div>
	);
}

export default CurrentMemberButton;
