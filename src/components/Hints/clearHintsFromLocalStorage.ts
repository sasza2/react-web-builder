import type { HelperArrowItem } from "types";

export const clearHintsFromLocalStorage = (list: HelperArrowItem[]) => {
	list.forEach((item) => {
		const name = `hint-${item.selector}`; // TODO
		localStorage.removeItem(name);
	});
};
