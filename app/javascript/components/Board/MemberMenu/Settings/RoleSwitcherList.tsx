import HintIcon from "@/components/General/Hint/HintIcon";
import { Label } from "@/shadcn/components/ui/label";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";
import { Separator } from "@/shadcn/components/ui/separator";
import { Switch } from "@/shadcn/components/ui/switch";
import { fullRoleType } from "@/Types/Member";
import React from "react";

type Props = {
	newRole: fullRoleType;
	setNewRole: (newRole: fullRoleType) => void;
	adminChangesIsDisabled: boolean;
};

function RoleSwitcherList({ newRole, setNewRole, adminChangesIsDisabled }: Props) {
	const switchers = [
		{
			label: "Can Edit",
			description: "Allows the user to edit the board.",
			checked: newRole.can_edit,
			setValue: (value: boolean) => setNewRole({ ...newRole, can_edit: value }),
			disabled: true,
		},
		{
			label: "Can ignore rules",
			description: "Allows the user to ignore rules.",
			checked: newRole.can_ignore_rules,
			setValue: (value: boolean) => setNewRole({ ...newRole, can_ignore_rules: value }),
			disabled: true,
		},
		{
			label: "Can change roles",
			description: "Allows the user to change general roles.",
			checked: newRole.can_change_roles,
			setValue: (value: boolean) => setNewRole({ ...newRole, can_change_roles: value }),
			disabled: adminChangesIsDisabled,
		},
		{
			label: "Can assign admin",
			description: "Allows the user to assign admin roles.",
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
