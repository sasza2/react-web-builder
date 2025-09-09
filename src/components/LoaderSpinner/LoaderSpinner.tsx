import React from "react";
import { useTheme } from "styled-components";

import { Loader as LoaderIcon } from "../icons/Loader";
import { Container } from "./LoaderSpinner.styled";

type LoaderSpinnerProps = {
	color?: string;
	width?: number;
};

export function LoaderSpinner({ color, width = 15 }: LoaderSpinnerProps) {
	const theme = useTheme();
	return (
		<Container $color={color || theme.colors.darkBlue} $width={width}>
			<LoaderIcon />
		</Container>
	);
}
