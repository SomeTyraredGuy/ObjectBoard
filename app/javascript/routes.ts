import { getBaseURL, getFullURL } from "./scripts/requestUtils";

function getRoutes(router = false) {
	const locale = router ? ":locale?" : window.currentLocale || "en";

	return {
		home: () => `/${locale}`,

		boards: () => `/${locale}/boards`,
		boardsApi: () => `${getFullURL()}/all`,

		board: (id?: number) => `/${locale}/boards/${router ? ":id" : id}`,
		boardApi: () => `${getFullURL()}/one`,

		currentMemberApi: () => `${getFullURL()}/member/current`,
		otherMembersApi: () => `${getFullURL()}/member/others`,
		addMemberApi: () => getFullURL() + "/member/add_to_board",
		updateMemberRoleApi: (id?: number) => `${getFullURL()}/member/update_role/${router ? ":id" : id}`,

		saveCanvasContentApi: () => `${getFullURL()}/content/save`,
		getCanvasContentApi: () => `${getFullURL()}/content/get`,

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
