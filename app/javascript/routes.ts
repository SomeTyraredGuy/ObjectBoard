const locale = window.currentLocale || "en";

const ROUTES = {
	home: () => `/${locale}`,
	boards: () => `/${locale}/boards`,
	board: (id: string) => `/${locale}/boards/${id}`,
	signUp: () => `/${locale}/users/sign_up`,
	signUpApi: () => `/${locale}/users`,
	signIn: () => `/${locale}/users/sign_in`,
	signOut: () => `/${locale}/users/sign_out`,
	profile: () => `/${locale}/users/edit`,
};

export default ROUTES;
