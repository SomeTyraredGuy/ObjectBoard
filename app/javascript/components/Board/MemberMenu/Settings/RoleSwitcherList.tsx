import HintIcon from "@/components/General/Hint/HintIcon";
import { Label } from "@/shadcn/components/ui/label";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";
import { Separator } from "@/shadcn/components/ui/separator";
import { Switch } from "@/shadcn/components/ui/switch";
import { fullRoleType } from "@/Types/Member";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
	newRole: fullRoleType;
	setNewRole: (newRole: fullRoleType) => void;
	adminChangesIsDisabled: boolean;
};

function RoleSwitcherList({ newRole, setNewRole, adminChangesIsDisabled }: Props) {
	const { t } = useTranslation("translation", { keyPrefix: "board.members_menu.role.settings" });
	const switchers = [
		{
			label: t("can_edit.label"),
			description: t("can_edit.description"),
			checked: newRole.can_edit,
			setValue: (value: boolean) => setNewRole({ ...newRole, can_edit: value }),
			disabled: true,
		},
		{
			label: t("can_ignore_rules.label"),
			description: t("can_ignore_rules.description"),
			checked: newRole.can_ignore_rules,
			setValue: (value: boolean) => setNewRole({ ...newRole, can_ignore_rules: value }),
			disabled: true,
		},
		{
			label: t("can_change_roles.label"),
			description: t("can_change_roles.description"),
			checked: newRole.can_change_roles,
			setValue: (value: boolean) => setNewRole({ ...newRole, can_change_roles: value }),
			disabled: adminChangesIsDisabled,
		},
		{
			label: t("can_assign_admin.label"),
			description: t("can_assign_admin.description"),
			checked: newRole.can_assign_admin,
			setValue: (value: boolean) => setNewRole({ ...newRole, can_assign_admin: value }),
			disabled: adminChangesIsDisabled,
		},
	];

	return (
		<ScrollArea className="border-standard max-h-72 w-full rounded-2xl">
			<div className="p-4">
				{switchers.map((switcher, i) => (
					<div key={i}>
						<div className="flex items-center space-x-2">
							<Switch
								disabled={switcher.disabled}
								checked={switcher.checked}
								onCheckedChange={(checked) => switcher.setValue(checked)}
							/>
							<Label>{switcher.label}</Label>
							<HintIcon
								className="size-4.5"
								title={switcher.label}
								description={switcher.description}
								side="right"
							/>
						</div>

						{i + 1 !== switchers.length && <Separator className="my-4" />}
					</div>
				))}
			</div>
		</ScrollArea>
	);
}

export default RoleSwitcherList;
