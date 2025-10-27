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
