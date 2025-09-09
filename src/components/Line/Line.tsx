import React from "react";
import type { LineComponentProps } from "types";

import { Container } from "./Line.styled";

export function Line({
	dashesWidth,
	dashesGap,
	backgroundColor,
	borderRadius,
	height,
	type,
}: LineComponentProps) {
	const lineStyle: React.CSSProperties = {
		stroke: backgroundColor,
		strokeWidth: height,
	};

	if (type === "dashed") {
		lineStyle.strokeDasharray = `${dashesWidth} ${dashesGap}`;
	}

	return (
		<Container $borderRadius={borderRadius} $height={height}>
			<svg style={{ width: "100%", height }}>
				<line x1="0%" y1="50%" x2="100%" y2="50%" style={lineStyle} />
			</svg>
		</Container>
	);
}
