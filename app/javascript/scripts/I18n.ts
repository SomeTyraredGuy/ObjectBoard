import i18n, { Resource } from "i18next";
import { initReactI18next } from "react-i18next";

declare global {
	interface Window {
		frontendTranslations: Resource;
		currentLocale: string;
	}
}

i18n.use(initReactI18next).init({
	resources: window.frontendTranslations || {},
	lng: window.currentLocale || "en",
	debug: true,

	interpolation: {
		escapeValue: false, // not needed for react as it escapes by default
	},
});

export default i18n;
