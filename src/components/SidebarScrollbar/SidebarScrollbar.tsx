import React from "react";

import { Scrollbar } from "@/components/Scrollbar";

import { useWebBuilderSizeHeight } from "../WebBuilderSize";
import { Empty, Wrapper } from "./SidebarScrollbar.styled";

export function SidebarScrollbar({ children }: React.PropsWithChildren) {
	const height = useWebBuilderSizeHeight();
	return (
		<Wrapper $height={height}>
			<Scrollbar>
				{children}
				<Empty />
			</Scrollbar>
		</Wrapper>
	);
}
