import { getBaseURL, getFullURL } from "./scripts/requestUtils";

function getRoutes(router = false) {
	const locale = router ? ":locale?" : window.currentLocale || "en";

	return {
		home: () => `/${locale}`,

		boards: () => `/${locale}/boards`,
		allBoardsApi: () => `${getFullURL()}/all`,

		board: (id?: number) => `/${locale}/boards/${router ? ":id" : id}`,
		getOneBoardApi: () => `${getFullURL()}/one`,
		deleteBoardApi: (boardId: number) => `${getBaseURL()}/boards/${boardId}`,
		createBoardApi: () => `${getBaseURL()}/boards`,

		currentMemberApi: () => `${getFullURL()}/member/current`,
		otherMembersApi: () => `${getFullURL()}/member/others`,
		addMemberApi: () => getFullURL() + "/member/add_to_board",
		updateMemberRoleApi: (member_id: number) => `${getFullURL()}/member/update_role/${member_id}`,
		leaveBoardApi: (boardId: number) => `${getBaseURL()}/boards/${boardId}/member/leave_board`,
		acceptInviteApi: (boardId: number) => `${getBaseURL()}/boards/${boardId}/member/accept_invite`,
		kickMemberApi: (memberId: number) => `${getFullURL()}/member/kick/${memberId}`,

		saveBoardContentApi: () => `${getFullURL()}/content/save`,
		getBoardContentApi: () => `${getFullURL()}/content/get`,

		UserApi: () => `${getBaseURL()}/users`,

		signUp: () => `/${locale}/users/sign_up`,
		signIn: () => `/${locale}/users/sign_in`,
		signOutApi: () => getBaseURL() + "/users/sign_out",
		profile: () => `/${locale}/users/edit`,
	};
}
const ROUTES = getRoutes();

export default ROUTES;
export { getRoutes };
