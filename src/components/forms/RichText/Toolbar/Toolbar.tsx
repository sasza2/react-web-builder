import React from "react";

import { MenuWrapper, ToolbarWrapper } from "./Toolbar.styled";

interface BaseProps {
	className: string;
	[key: string]: unknown;
}
type OrNull<T> = T | null;

export const Menu = React.forwardRef(
	(
		{ className, ...props }: React.PropsWithChildren<BaseProps>,
		ref: React.Ref<OrNull<HTMLDivElement>>,
	) => <MenuWrapper {...props} data-test-id="menu" ref={ref} />,
);

Menu.displayName = "Menu";

export const Toolbar = React.forwardRef(
	(
		{ className, ...props }: React.PropsWithChildren<BaseProps>,
		ref: React.Ref<OrNull<HTMLDivElement>>,
	) => <ToolbarWrapper {...props} ref={ref} />,
);

Toolbar.displayName = "Toolbar";
