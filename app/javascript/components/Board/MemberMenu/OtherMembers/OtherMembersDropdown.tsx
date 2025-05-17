import React from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shadcn/components/ui/dropdown-menu";
import MembersIcon from "./MembersIcon";
import MemberListItem from "./MemberListItem";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";
import { CurrentMember, OtherMember } from "@/Types/Member";
import AddMemberButton from "./AddMemberButton";
import { useTranslation } from "react-i18next";

type Props = {
	currentMember: CurrentMember;
	otherMembers: OtherMember[];
	toggleMemberMenu: (member: OtherMember | null) => void;
	toggleAddMemberMenu: () => void;
};

function OtherMembersDropdown({ currentMember, otherMembers, toggleMemberMenu, toggleAddMemberMenu }: Props) {
	const { t } = useTranslation("translation", { keyPrefix: "board.members_menu.other" });
	if (otherMembers.length === 0)
		return <AddMemberButton toggleAddMemberMenu={toggleAddMemberMenu} className="h-full" />;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				{otherMembers.length > 0 && (
					<MembersIcon avatars={otherMembers.slice(0, 3).map((member) => member.avatar)} />
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-sm bg-background">
				<DropdownMenuLabel className="text-center text-lg">{t("label")}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<ScrollArea>
					<div className="max-h-120 w-full pr-2">
						{otherMembers?.map((member: OtherMember, i: number) => (
							<MemberListItem
								member={member}
								key={i}
								disabledButton={currentMember ? !currentMember.role.can_change_roles : true}
								toggleMenu={toggleMemberMenu}
							/>
						))}
						{currentMember.role.can_change_roles && (
							<>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<AddMemberButton toggleAddMemberMenu={toggleAddMemberMenu} className="h-14" />
								</DropdownMenuItem>
							</>
						)}
					</div>
				</ScrollArea>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default OtherMembersDropdown;
