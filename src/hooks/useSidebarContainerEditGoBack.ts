import { setSelectedElement } from "@/store/selectedElementSlice";
import { useAppDispatch } from "@/store/useAppDispatch";
import { useAppSelector } from "@/store/useAppSelector";
import { byBreakpointId, isContainer } from "@/utils/breakpoint";
import { getElementContainerIdProp } from "@/utils/element";

import { useBreakpoint } from "./useBreakpoint";
import { useBreakpoints } from "./useBreakpoints";

export const useSidebarContainerEditGoBack = (): (() => void) | undefined => {
	const container = useBreakpoint();
	const breakpoints = useBreakpoints();
	const elementsInBreakpoints = useAppSelector(
		(state) => state.elementsInBreakpoints,
	);
	const dispatch = useAppDispatch();

	const goBack = () => {
		const parent = breakpoints.find(byBreakpointId(container.parentId));

		const elements = elementsInBreakpoints[parent.id];
		const elementParent = elements.find((element) => {
			if (element.componentName !== "Container") return false;

			const containerIdProp = getElementContainerIdProp(element.props);
			if (containerIdProp && containerIdProp.value === container.id)
				return true;

			return false;
		});

		if (elementParent) {
			dispatch(
				setSelectedElement({
					elementId: elementParent.id,
					breakpointId: parent.id,
				}),
			);
		}
	};

	return isContainer(container) ? goBack : undefined;
};
