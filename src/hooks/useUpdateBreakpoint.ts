import { useCallback } from "react";
import type { Breakpoint } from "types";

import { updateBreakpoint } from "@/store/breakpointsSlice";
import { useAppDispatch } from "@/store/useAppDispatch";

export const useUpdateBreakpoint = () => {
	const dispatch = useAppDispatch();

	const update = useCallback(
		(breakpointId: string, breakpoint: Partial<Breakpoint>) => {
			dispatch(updateBreakpoint({ breakpointId, breakpoint }));
		},
		[dispatch],
	);

	return update;
};
