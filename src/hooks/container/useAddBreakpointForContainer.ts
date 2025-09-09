import { useTranslation } from "react-i18next";
import type { ElementsExtras } from "types";

import { setElementsInBreakpointProgrammatic } from "@/store/elementsInBreakpointsSlice";
import { useAppDispatch } from "@/store/useAppDispatch";
import {
	createElementsForContainer,
	getDefaultContainer,
} from "@/utils/container";

import { useAddBreakpoint } from "../useAddBreakpoint";
import { useBreakpoint } from "../useBreakpoint";
import { useElements } from "../useElements";

export const useAddBreakpointForContainer = () => {
	const dispatch = useAppDispatch();
	const addBreakpoint = useAddBreakpoint();
	const parent = useBreakpoint();
	const { elementsExtras } = useElements();
	const { t } = useTranslation();

	const addBreakpointForContainer = () => {
		const container = addBreakpoint(getDefaultContainer(parent), {
			silent: true,
		});

		const { elements, getPaddingBottom, measureContainerElement } =
			createElementsForContainer(container, parent, t);

		elementsExtras.current[container.id] = elements.reduce(
			(extras, element) => {
				extras[element.id] = {
					height: measureContainerElement(element.id),
					paddingBottom: getPaddingBottom(element.id),
				};

				return extras;
			},
			{} as ElementsExtras,
		);

		dispatch(
			setElementsInBreakpointProgrammatic({
				elements,
				breakpointId: container.id,
			}),
		);

		return container.id;
	};

	return addBreakpointForContainer;
};
