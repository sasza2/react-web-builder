import type { Breakpoint } from "types";

import { useAppSelector } from "@/store/useAppSelector";
import { byBreakpointId } from "@/utils/breakpoint";

type UseBreakpoint = () => Breakpoint | null;

export const useBreakpoint: UseBreakpoint = () => {
	const breakpoint = useAppSelector((state) => {
		const selectedBreakpoint = state.breakpoints.find(
			byBreakpointId(state.selectedBreakpoint),
		);
		return selectedBreakpoint || null;
	});
	return breakpoint;
};
