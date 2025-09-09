import React, { type CSSProperties } from "react";

import type { IconWrapperProps } from "./types";

type ColorGradientProps = IconWrapperProps & {
	height?: CSSProperties["height"];
	width?: CSSProperties["width"];
};

export function ColorGradient(props: ColorGradientProps) {
	return (
		<svg
			viewBox="0 0 18 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<g filter="url(#filter0_i_727_636)">
				<rect
					width="18"
					height="18"
					rx="2"
					fill="url(#paint0_linear_727_636)"
				/>
			</g>
			<defs>
				<filter
					id="filter0_i_727_636"
					x="0"
					y="0"
					width="18"
					height="19"
					filterUnits="userSpaceOnUse"
					colorInterpolationFilters="sRGB"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="BackgroundImageFix"
						result="shape"
					/>
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dy="1" />
					<feGaussianBlur stdDeviation="2" />
					<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
					/>
					<feBlend
						mode="normal"
						in2="shape"
						result="effect1_innerShadow_727_636"
					/>
				</filter>
				<linearGradient
					id="paint0_linear_727_636"
					x1="9"
					y1="0"
					x2="9"
					y2="18"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#C5C5C5" />
					<stop offset="1" stopColor="#5F5F5F" />
				</linearGradient>
			</defs>
		</svg>
	);
}
