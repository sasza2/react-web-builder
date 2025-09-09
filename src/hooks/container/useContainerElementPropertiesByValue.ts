import { useCallback } from "react";
import type { Breakpoint, WebBuilderElement } from "types";

import { useComponentsProperty } from "@/components/ComponentsProvider";
import { useProperties } from "@/components/PropertiesProvider";
import { useAppSelector } from "@/store/useAppSelector";
import { byBreakpointId } from "@/utils/breakpoint";
import { getElementContainerIdProp, getProperties } from "@/utils/element";

import { useBreakpoints } from "../useBreakpoints";

const NO_PROPERTIES = {};

export const useContainerElementPropertiesByValue: () => (
	container: Breakpoint,
) => Record<string, unknown> = () => {
	const breakpoints = useBreakpoints();
	const elementsInBreakpoints = useAppSelector(
		(state) => state.elementsInBreakpoints,
	);

	const { transformElementProperty } = useProperties();
	const components = useComponentsProperty();

	return useCallback(
		(container: Breakpoint) => {
			if (!container.parentId) return NO_PROPERTIES;

			const parent = breakpoints.find(byBreakpointId(container.parentId));

			if (!parent) return NO_PROPERTIES;

			const elements = elementsInBreakpoints[parent.id];

			if (!elements) return NO_PROPERTIES;

			const element = elements.find(
				({ props }: WebBuilderElement): string | null => {
					const containerId = getElementContainerIdProp(props);
					if (containerId && containerId.value === container.id)
						return containerId.value;
					return null;
				},
			);

			if (!element) return NO_PROPERTIES;

			const component = components.find(
				({ id }) => id === element.componentName,
			);

			return getProperties(
				component,
				container,
				element,
				transformElementProperty,
			);
		},
		[breakpoints, elementsInBreakpoints, components, transformElementProperty],
	);
};
