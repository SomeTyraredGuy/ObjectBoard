import React from "react";
import { CurrentMember } from "../../../../Types/Member";
import { useTranslation } from "react-i18next";

type Props = {
	currentMember: CurrentMember;
	toggleMemberMenu: (member: CurrentMember | null) => void;
};

function CurrentMemberButton({ currentMember, toggleMemberMenu }: Props) {
	const { t } = useTranslation("translation", { keyPrefix: "board.members_menu.role" });
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
					{t("label")}
					{t(currentMember.role.name)}
				</span>
			</button>
		</div>
	);
}

export default CurrentMemberButton;
