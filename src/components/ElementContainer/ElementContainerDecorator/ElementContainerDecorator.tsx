import React from "react";
import type { Breakpoint } from "types";
import { useProperties } from "@/components/PropertiesProvider";

type ElementContainerDecoratorProps = {
	children: React.ReactNode;
	container?: Breakpoint;
};

export const ElementContainerDecorator: React.FC<
	ElementContainerDecoratorProps
> = ({ children, container, ...props }) => {
	const { elementContainerDecorator } = useProperties();

	if (!elementContainerDecorator) return children as JSX.Element;

	const Decorator = elementContainerDecorator;
	return (
		<Decorator {...props} container={container}>
			{children}
		</Decorator>
	);
};
