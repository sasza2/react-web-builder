import type { WebBuilderElement, WebBuilderElements } from "types";

const getElementsFromBoard = (
	board: Array<WebBuilderElements>,
): WebBuilderElements => {
	const elementsMap: Record<string | number, WebBuilderElement> = {};
	board.forEach((row) => {
		row.forEach((element) => {
			if (element) elementsMap[element.id] = element;
		});
	});
	return Object.values(elementsMap);
};

export default getElementsFromBoard;
