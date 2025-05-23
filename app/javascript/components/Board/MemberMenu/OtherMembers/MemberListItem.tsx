import { Button } from "@/shadcn/components/ui/button";
import { DropdownMenuItem } from "@/shadcn/components/ui/dropdown-menu";
import { OtherMember } from "@/Types/Member";
import { UserCircleIcon } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
	member: OtherMember;
	toggleMenu: (member: OtherMember) => void;
	disabledButton: boolean;
};

function MemberListItem({ member, toggleMenu, disabledButton }: Props) {
	const { t } = useTranslation("translation", { keyPrefix: "board.members_menu.role" });
	return (
		<DropdownMenuItem className="flex justify-between">
			{/* <img src={member.avatar} alt={member.name} className="mr-2 h-11 w-11 rounded-full" /> */}
			<UserCircleIcon className="text-foreground size-10" />
			<span className="truncate text-xl">{member.name}</span>
			<Button
				variant="outline"
				className="hover:bg-primary hover:text-primary-foreground h-12 w-24 text-center"
				onClick={() => toggleMenu(member)}
				disabled={disabledButton}
			>
				<span>{t(member.role.name)}</span>
			</Button>
		</DropdownMenuItem>
	);
}

export default MemberListItem;
