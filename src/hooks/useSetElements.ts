import type { WebBuilderElements } from "types";

import { setElementsInBreakpoint } from "@/store/elementsInBreakpointsSlice";
import { useAppDispatch } from "@/store/useAppDispatch";

import { useBreakpoint } from "./useBreakpoint";

export const useSetElements = () => {
	const dispatch = useAppDispatch();
	const breakpoint = useBreakpoint();

	const setElements = (elements: WebBuilderElements) => {
		dispatch(
			setElementsInBreakpoint({
				elements,
				breakpointId: breakpoint.id,
			}),
		);
	};

	return setElements;
};
