import type { WebBuilderComponent } from "types";

export const prepareComponents = (
	components: WebBuilderComponent[],
): WebBuilderComponent[] =>
	components.map((component) => {
		if (component.props) return component;

		return {
			...component,
			props: [],
		};
	});

export const isContainerComponent = (
	componentName: string,
	components: WebBuilderComponent[],
): boolean => {
	const component = components.find((item) => item.id === componentName);
	return Boolean(component?.isContainer);
};
