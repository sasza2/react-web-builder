import React from "react";

import { useBreakpoint } from "@/hooks/useBreakpoint";

import { Container } from "./BuilderElementAnchor.styled";

type BuilderElementAnchorProps = {
	anchorId: string;
};

export function BuilderElementAnchor({ anchorId }: BuilderElementAnchorProps) {
	const breakpoint = useBreakpoint();
	const rowHeight = breakpoint?.rowHeight || 0;

	return (
		<Container $rowHeight={rowHeight}>
			<svg
				height="80%"
				viewBox="0 0 500 100"
				preserveAspectRatio="xMinYMid meet"
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
			>
				<text x="0" y="75" fontSize="75" fill="black">
					#{anchorId}
				</text>
			</svg>
		</Container>
	);
}
