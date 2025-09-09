import React, { memo, useCallback } from "react";
import { useTheme } from "styled-components";

import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useGetBreakpointWidth } from "@/hooks/useGetBreakpointWidth";

import { BackgroundDiv } from "./DotBackground.styled";

const DOT_SIZE = 2; // px

function DotBackgroundIn() {
	const theme = useTheme();
	const breakpoint = useBreakpoint();
	const getBreakpointWidth = useGetBreakpointWidth();

	const onInit = useCallback(
		(node: HTMLDivElement) => {
			if (!node) return;

			const height = breakpoint.rowHeight;
			const width = getBreakpointWidth(breakpoint);
			const colWidth = width / breakpoint.cols;

			const c = document.createElement("canvas");
			c.setAttribute("width", `${width}px`);
			c.setAttribute("height", `${height}px`);
			const ctx = c.getContext("2d");
			if (ctx === null) return;

			for (let x = 0; x <= breakpoint.cols; x++) {
				ctx.beginPath();
				let offset = 0;

				if (x === 0) {
					offset = DOT_SIZE;
				} else if (x === breakpoint.cols) {
					offset = -DOT_SIZE * 2;
				}

				const arcX = colWidth * x + DOT_SIZE + offset;
				const arcY = DOT_SIZE;

				ctx.arc(arcX, arcY, 1, 0, DOT_SIZE * Math.PI);
				ctx.strokeStyle = `${theme.colors.black}40`;
				ctx.stroke();
			}

			node.style.backgroundImage = `url(${c.toDataURL()})`;
			node.style.backgroundRepeat = "repeat";
			node.style.backgroundPosition = `-${DOT_SIZE}px -${DOT_SIZE}px`;
		},
		[breakpoint.cols, breakpoint.rowHeight],
	);

	return <BackgroundDiv ref={onInit} />;
}

export const DotBackground = memo(DotBackgroundIn);
