function getCSRFToken() {
	const metaTag = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
	return metaTag ? metaTag.content : null;
};

function getBaseURL() {
	const metaTag = document.querySelector('meta[name="url-with-path"]') as HTMLMetaElement | null;
	return metaTag ? metaTag.content : null;
};

export { getCSRFToken, getBaseURL }