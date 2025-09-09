import type { Breakpoint } from "types";

import { useGridAPI } from "@/components/GridAPIProvider";
import { removeElementsFromBreakpoint } from "@/store/elementsInBreakpointsSlice";
import { useAppDispatch } from "@/store/useAppDispatch";
import { delay } from "@/utils/delay";

type UseRemoveElementsByBreakpoint = () => (breakpoint: Breakpoint) => void;

const useRemoveElementsByBreakpoint: UseRemoveElementsByBreakpoint = () => {
	const dispatch = useAppDispatch();
	const gridAPIRef = useGridAPI();

	const remove = async (breakpoint: Breakpoint) => {
		dispatch(
			removeElementsFromBreakpoint({
				currentBreakpoint: breakpoint,
				elementsTree: [],
				removeBreakpoint: true,
			}),
		);

		await delay(200);
		gridAPIRef.current.getPanZoom().goBackToBoundary();
	};

	return remove;
};

export default useRemoveElementsByBreakpoint;
