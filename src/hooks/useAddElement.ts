import type { WebBuilderElement } from "types";

import { addElementToBreakpoint } from "@/store/elementsInBreakpointsSlice";
import { useAppDispatch } from "@/store/useAppDispatch";

import { useBreakpoint } from "./useBreakpoint";

export const useAddElement = () => {
	const dispatch = useAppDispatch();
	const breakpoint = useBreakpoint();

	return (element: WebBuilderElement) => {
		dispatch(addElementToBreakpoint({ element, breakpointId: breakpoint.id }));
	};
};
