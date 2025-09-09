import React, { useId } from "react";
import { Tooltip } from "react-tooltip";

import { assignTestProp } from "@/utils/tests";

import { Container } from "./ButtonIcon.styled";

type ButtonIconProps = React.PropsWithChildren<{
	active?: boolean;
	disabled?: boolean;
	id?: string;
	onClick?: () => void;
	size?: "big" | "small";
	testId?: string;
	tooltip?: string;
	transparent?: boolean;
}>;

export function ButtonIcon({
	active,
	children,
	disabled,
	id,
	onClick,
	size,
	testId,
	tooltip,
	transparent,
}: ButtonIconProps) {
	const tooltipId = useId();
	return (
		<>
			<Container
				data-tooltip-id={tooltipId}
				data-icon-id={id}
				$active={active}
				$disabled={disabled}
				disabled={disabled}
				$size={size}
				$transparent={transparent}
				onClick={onClick}
				type="button"
				{...assignTestProp(testId)}
			>
				{children}
			</Container>
			{tooltip && <Tooltip id={tooltipId}>{tooltip}</Tooltip>}
		</>
	);
}
