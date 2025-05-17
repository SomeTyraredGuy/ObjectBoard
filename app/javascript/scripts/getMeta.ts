export default function getMeta(name: string) {
	const metaTag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
	return metaTag ? metaTag.content : null;
}
