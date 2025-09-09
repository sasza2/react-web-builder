import type { WebBuilderElement } from "types";

import { addElementsToBreakpoint } from "@/store/elementsInBreakpointsSlice";
import { useAppDispatch } from "@/store/useAppDispatch";

import { useBreakpoint } from "./useBreakpoint";

export const useAddElements = () => {
	const dispatch = useAppDispatch();
	const breakpoint = useBreakpoint();

	return (elements: WebBuilderElement[]) => {
		dispatch(
			addElementsToBreakpoint({ elements, breakpointId: breakpoint.id }),
		);
	};
};
