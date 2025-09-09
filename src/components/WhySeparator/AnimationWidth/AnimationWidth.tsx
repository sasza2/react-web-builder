import React, { useEffect, useState } from "react";

import { Container } from "./AnimationWidth.styled";

type AnimationWidthProps = React.PropsWithChildren<{
	from: number;
	to: number;
	speed: number;
}>;

export function AnimationWidth({
	children,
	from,
	to,
	speed,
}: AnimationWidthProps) {
	const [width, setWidth] = useState(from);

	useEffect(() => {
		const timer = setTimeout(() => {
			setWidth(to);
		});

		return () => {
			clearTimeout(timer);
		};
	}, [to]);

	const style = {
		width,
		"--speed": `${speed}ms`,
		transform: "scale()",
	};

	return <Container style={style}>{children}</Container>;
}
