import type { WebBuilderElement } from "types";

import { useComponentsProperty } from "@/components/ComponentsProvider";
import { useAppSelector } from "@/store/useAppSelector";
import { createTreeFromBreakpoint } from "@/utils/breakpoint";

import { useBreakpoint } from "./useBreakpoint";
import { useBreakpoints } from "./useBreakpoints";
import { useElements } from "./useElements";

export const useCreateTreeFromBreakpoint = () => {
	const breakpoint = useBreakpoint();
	const breakpoints = useBreakpoints();
	const components = useComponentsProperty();
	const { elementsExtras } = useElements();
	const elementsInBreakpoints = useAppSelector(
		(state) => state.elementsInBreakpoints,
	);

	const create = (
		selectedElements: WebBuilderElement[],
		rewriteContainersIds: boolean,
	) =>
		createTreeFromBreakpoint({
			allBreakpoints: breakpoints,
			components,
			elementsInBreakpoints,
			selectedElements,
			currentBreakpoint: breakpoint,
			elementsExtras: elementsExtras.current,
			rewriteContainersIds,
		});

	return create;
};
