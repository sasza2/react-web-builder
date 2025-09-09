import { useContext } from "react";

import { ElementsContext } from "@/components/ElementsProvider";
import { useGridAPI } from "@/components/GridAPIProvider";
import { assignAllToElementsExtras } from "@/utils/breakpoint";

import { useBreakpoint } from "./useBreakpoint";

export const useSetElementsHeight = () => {
	const gridAPI = useGridAPI();
	const breakpoint = useBreakpoint();
	const { elementsExtras } = useContext(ElementsContext);

	return () => {
		assignAllToElementsExtras(elementsExtras, breakpoint, gridAPI);
	};
};
