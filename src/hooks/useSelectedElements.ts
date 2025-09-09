import {
	setSelectedElements,
	toggleSelectedElement,
} from "@/store/selectedElementsSlice";
import { useAppDispatch } from "@/store/useAppDispatch";
import { useAppSelector } from "@/store/useAppSelector";

type UseSelectedElements = () => {
	selectedElements: Array<string | number>;
	setSelectedElements: (selectedElements: Array<string | number>) => void;
	toggleSelectedElement: (elementId: string | number) => void;
};

export const useSelectedElements: UseSelectedElements = () => {
	const selectedElements = useAppSelector((state) => state.selectedElements);
	const dispatch = useAppDispatch();

	const setSelectedElementsDispatch = (
		nextSelectedElements: Array<string | number>,
	) => {
		dispatch(
			setSelectedElements({
				elementsIds: nextSelectedElements,
			}),
		);
	};

	const toggleSelectedElementDispatch = (elementId: string | number) => {
		dispatch(
			toggleSelectedElement({
				elementId,
			}),
		);
	};

	return {
		selectedElements,
		setSelectedElements: setSelectedElementsDispatch,
		toggleSelectedElement: toggleSelectedElementDispatch,
	};
};
