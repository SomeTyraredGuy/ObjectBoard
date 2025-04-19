import { Button } from "@/shadcn/components/ui/button";
import { DropdownMenuItem } from "@/shadcn/components/ui/dropdown-menu";
import { OtherMember } from "@/Types/Member";
import React from "react";

type Props = {
	member: OtherMember;
	toggleMenu: (member: OtherMember) => void;
	disabledButton: boolean;
};

function MemberListItem({ member, toggleMenu, disabledButton }: Props) {
	return (
		<DropdownMenuItem className="flex justify-between">
			<img src={member.avatar} alt={member.name} className="mr-2 h-11 w-11 rounded-full" />
			<span className="truncate text-xl">{member.name}</span>
			<Button
				variant="outline"
				className="hover:bg-primary hover:text-primary-foreground h-12 w-24 text-center"
				onClick={() => toggleMenu(member)}
				disabled={disabledButton}
			>
				<span>{member.role.name}</span>
			</Button>
		</DropdownMenuItem>
	);
}

export default MemberListItem;
