import getMeta from "./getMeta";

function getCSRFToken() {
	return getMeta("csrf-token");
}

function getBaseURL() {
	return window.location.href;
}

export { getCSRFToken, getBaseURL };
