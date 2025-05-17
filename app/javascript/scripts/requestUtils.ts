import getMeta from "./getMeta";

function getCSRFToken() {
	return getMeta("csrf-token");
}

function getBaseURL() {
	return getMeta("url-with-path");
}

export { getCSRFToken, getBaseURL };
