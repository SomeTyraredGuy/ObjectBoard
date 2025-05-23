import getMeta from "./getMeta";

function getCSRFToken() {
	return getMeta("csrf-token");
}

function setCSRFToken(token) {
	const metaTag = document.querySelector('meta[name="csrf-token"]');
	if (metaTag) {
		metaTag.setAttribute("content", token);
	}
}

function getBaseURL() {
	const locale = window.currentLocale || "en";
	return `${window.location.origin}/${locale}`;
}

function getFullURL() {
	return window.location.href;
}

export { getCSRFToken, setCSRFToken, getBaseURL, getFullURL };
