import React from "react";

import type { IconWrapperProps } from "./types";

export function Anchor(props: IconWrapperProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" {...props}>
			<circle
				cx="50"
				cy="50"
				r="45"
				stroke="black"
				strokeWidth="6"
				fill="none"
			/>
			<path
				d="M50,20 C60,20 60,40 50,40 C40,40 40,20 50,20"
				stroke="black"
				strokeWidth="6"
				fill="none"
			/>
			<line x1="50" y1="40" x2="50" y2="70" stroke="black" strokeWidth="6" />
			<polygon points="45,70 50,80 55,70" fill="black" />
		</svg>
	);
}
