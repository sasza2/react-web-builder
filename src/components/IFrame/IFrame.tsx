import React from "react";
import type { IFrameComponentProps } from "types";

import { useBoxStyle } from "../View/Box/useBoxStyle";
import { Container, Empty } from "./IFrame.styled";

export function IFrame({
	backgroundColor,
	border = {},
	boxShadow,
	element,
	height,
	padding = {},
	src,
}: IFrameComponentProps) {
	const style = useBoxStyle({
		backgroundColor,
		boxShadow,
		border,
		padding,
	});

	return (
		<Container style={style}>
			{src ? (
				<iframe
					width="100%"
					height={height}
					title={`web builder ${element.id}`}
					src={src.location}
				/>
			) : (
				<Empty $height={height} />
			)}
		</Container>
	);
}
