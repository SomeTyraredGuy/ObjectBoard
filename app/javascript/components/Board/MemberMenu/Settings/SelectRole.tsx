import React from "react";
import { Select } from "@/shadcn/components/ui/select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/components/ui/select";
import { fullRoleType } from "@/Types/Member";
import { useTranslation } from "react-i18next";

type Props = {
	currentMemberRole: fullRoleType;
	onChange: (value: string) => void;
	defaultValue: string;
	disabled: boolean;
};

function SelectRole({ currentMemberRole, onChange, defaultValue, disabled }: Props) {
	const { t } = useTranslation("translation", { keyPrefix: "board.members_menu.role" });
	const roles = [
		{ name: "Owner", disabled: true },
		{ name: "Admin", disabled: !currentMemberRole.can_assign_admin },
		{ name: "Editor", disabled: !currentMemberRole.can_change_roles },
		{ name: "Viewer", disabled: !currentMemberRole.can_change_roles },
	];

	return (
		<Select onValueChange={onChange} defaultValue={defaultValue} disabled={disabled}>
			<SelectTrigger className="place-self-center-safe w-40">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{roles.map((role, i) => {
					return (
						<SelectItem key={i} value={role.name} disabled={role.disabled}>
							{t(role.name)}
						</SelectItem>
					);
				})}
			</SelectContent>
		</Select>
	);
}

export default SelectRole;
