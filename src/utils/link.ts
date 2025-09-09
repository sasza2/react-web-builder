export const isValidLink = (link?: string): boolean => {
	if (!link) return false;
	return (
		link.startsWith("/") ||
		link.startsWith("#") ||
		link.startsWith("mailto:") ||
		link.startsWith("https://")
	);
};
