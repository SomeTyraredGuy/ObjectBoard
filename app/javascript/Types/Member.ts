export type fullRoleType = {
	name: string;
	can_edit: boolean;
	can_change_roles: boolean;
	can_assign_admin: boolean;
	can_ignore_rules: boolean;
};

type restrictedMemberType = {
	member_id: number;
	user_id: number;
	name: string;
	role: {
		name: string;
	};
};

type fullMemberType = {
	member_id: number;
	user_id: number;
	name: string;
	role: fullRoleType;
};

export type CurrentMember = fullMemberType;

export type OtherMember = fullMemberType | restrictedMemberType;
