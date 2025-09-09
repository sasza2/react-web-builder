import type { CSSProperties } from "react";
import type { BackgroundImage, Border, BreakpointHeight } from "types";

import { useBoxStyle } from "@/components/View/Box/useBoxStyle";

export type ContainerStyleProps = {
	backgroundImage?: BackgroundImage;
	border?: Border;
	breakpointHeight: BreakpointHeight;
	boxShadow?: string;
};

export const useContainerStyle = ({
	backgroundImage,
	border,
	breakpointHeight,
	boxShadow,
}: ContainerStyleProps): CSSProperties => {
	const style = useBoxStyle({
		border,
		boxShadow,
	});

	if (breakpointHeight?.enabled) {
		const height =
			parseInt(breakpointHeight?.height as unknown as string) || undefined;
		if (height) {
			const CSSHeight = `${height}px`;

			if (breakpointHeight?.responsive) {
				const CSSCalcHeight = `calc(${CSSHeight} / var(--breakpoint-scale, 1))`;
				style.height = CSSCalcHeight;
				style.maxHeight = CSSCalcHeight;
			} else {
				style.height = CSSHeight;
				style.maxHeight = CSSHeight;
			}
		}

		if (breakpointHeight?.overflow) {
			style.overflowY = breakpointHeight.overflow;
		}
	}

	if (backgroundImage?.location) {
		const image = `url(${backgroundImage.location})`;

		let repeat = "repeat";

		if (backgroundImage.repeat) {
			repeat = backgroundImage.repeat.type;
		}

		let position = "0% 0%";

		if (backgroundImage.position) {
			if (backgroundImage.position.type === "numbers") {
				position = `${backgroundImage.position.numbers.x.value}${backgroundImage.position.numbers.x.unit} ${backgroundImage.position.numbers.y.value}${backgroundImage.position.numbers.y.unit}`;
			} else {
				position = backgroundImage.position.type;
			}
		}

		let size = "auto auto";

		if (backgroundImage.size) {
			if (backgroundImage.size.type === "numbers") {
				size = `${backgroundImage.size.numbers.width.value}${backgroundImage.size.numbers.width.unit} ${backgroundImage.size.numbers.height.value}${backgroundImage.size.numbers.height.unit}`;
			} else {
				size = backgroundImage.size.type;
			}
		}

		style.backgroundImage = `${position} / ${size} ${repeat} ${image}`;
	}

	return style;
};
