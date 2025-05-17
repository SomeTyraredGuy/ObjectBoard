import React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shadcn/components/ui/dialog";
import { CurrentMember, fullRoleType, OtherMember } from "@/Types/Member";
import { Button } from "@/shadcn/components/ui/button";
import UseMemberMutation from "@/hooks/Board/Members/UseMemberMutation";
import SelectRole from "./SelectRole";
import RoleSwitcherList from "./RoleSwitcherList";
import useNotification from "@/hooks/useNotification";
import { useTranslation } from "react-i18next";

const roleDefaults = [
	{ name: "Admin", can_edit: true, can_change_roles: true, can_assign_admin: false, can_ignore_rules: true },
	{ name: "Editor", can_edit: true, can_change_roles: false, can_assign_admin: false, can_ignore_rules: false },
	{ name: "Viewer", can_edit: false, can_change_roles: false, can_assign_admin: false, can_ignore_rules: false },
];

type Props = {
	currentMember: CurrentMember;
	member: OtherMember;
	refetchFn: () => void;
	closeFn: () => void;
};

function MemberSettings({ currentMember, member, refetchFn, closeFn }: Props) {
	const { t } = useTranslation();
	const [newRole, setNewRole] = React.useState<fullRoleType>(member.role as fullRoleType);
	const {
		mutate: save,
		error,
		isError,
		isSuccess,
	} = UseMemberMutation({
		path: `update_role/${member.member_id}`,
		refetchFn: refetchFn,
		method: "PATCH",
	});

	useNotification({
		isError,
		error,
		isSuccess,
		successMessage: t("board.members_menu.role.settings.success_message", { nickname: member.name }),
	});

	function setNewRoleByName(newName) {
		setNewRole(roleDefaults.find((role) => role.name === newName));
	}

	function changesIsDisabled() {
		return (
			!currentMember.role.can_change_roles ||
			member.role.name === "Owner" ||
			(member.role.name === "Admin" && !currentMember.role.can_assign_admin)
		);
	}

	function adminChangesIsDisabled() {
		return newRole.name !== "Admin" || changesIsDisabled();
	}

	return (
		<Dialog open={true}>
			<DialogContent closeFn={closeFn}>
				<DialogHeader>
					<DialogTitle className="text-center text-2xl">{member.name}</DialogTitle>
					<DialogDescription>{t("board.members_menu.role.settings.label")}</DialogDescription>
				</DialogHeader>

				<SelectRole
					defaultValue={member.role.name}
					currentMemberRole={currentMember.role}
					onChange={setNewRoleByName}
					disabled={changesIsDisabled()}
				/>

				<RoleSwitcherList
					newRole={newRole}
					setNewRole={setNewRole}
					adminChangesIsDisabled={adminChangesIsDisabled()}
				/>

				<DialogFooter className="!justify-center">
					<Button className="w-26" onClick={() => save(newRole)} disabled={changesIsDisabled()}>
						{t("common.actions.save")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default MemberSettings;
