import { useRef } from "react";
import type { GridProps } from "react-grid-panzoom";
import type { WebBuilderElement, WebBuilderElements } from "types";

import { useElements } from "./useElements";
import { useSetElements } from "./useSetElements";
import { useSetElementsProgrammatic } from "./useSetElementsProgrammatic";

const groupById = (
	elements: WebBuilderElements,
): Record<string | number, WebBuilderElement> => {
	const map: Record<string, WebBuilderElement> = {};
	elements.forEach((element) => {
		map[element.id] = element;
	});
	return map;
};

const areElementsEqual = (a: WebBuilderElement, b: WebBuilderElement) =>
	a.x === b.x && a.y === b.y && a.w === b.w;

export const useSetGridElements = () => {
	const { elements } = useElements();
	const elementsRef = useRef<WebBuilderElements>();
	elementsRef.current = elements;
	const setElements = useSetElements();
	const setElementsProgrammatic = useSetElementsProgrammatic();

	const set: GridProps["setElements"] = (gridElements, { type }) => {
		const currentElements = groupById(elementsRef.current);
		let hasChanged = false;
		const nextElements = gridElements.map((gridElement) => {
			const element = { ...gridElement };
			delete element.render;

			if (!currentElements[element.id]) {
				hasChanged = true;
			} else {
				const currentElement = currentElements[element.id];
				if (
					!areElementsEqual(
						currentElement,
						element as unknown as WebBuilderElement,
					)
				) {
					hasChanged = true;
				}
			}

			return element as unknown as WebBuilderElement;
		});

		if (!hasChanged) return;

		if (type === "programmatic") setElementsProgrammatic(nextElements);
		else setElements(nextElements);
	};

	return set;
};
