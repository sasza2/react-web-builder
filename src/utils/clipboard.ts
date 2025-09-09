import copyToClipboard from "copy-to-clipboard";

let clipboard = "";

export const copy = (obj: unknown) => {
	const toCopy = JSON.stringify(obj);
	clipboard = toCopy;
	copyToClipboard(toCopy);
};

export const paste = (): unknown => {
	if (!clipboard) return;
	return JSON.parse(clipboard);
};

export const hasClipboard = () => !!clipboard;
