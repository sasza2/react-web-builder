import React, { useCallback, useState } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";

import { Icon } from "@/components/icons/Icon";

import { WhySeparator } from "../WhySeparator";
import {
	AnimationContainer,
	TooltipInline,
	TooltipPopup,
} from "./WhySeparatorTooltip.styled";

const WHY_SEPARATOR_TOOLTIP_ID = "why-separator"; // todo

type WhySeparatorTooltipProps = {
	className?: string;
};

export function WhySeparatorTooltip({ className }: WhySeparatorTooltipProps) {
	const { t } = useTranslation();
	const [showWhySeparator, setShowWhySeparator] = useState(false);

	const onClose = useCallback(() => {
		setShowWhySeparator(false);
	}, []);

	const showWhyToUseSeparator: React.MouseEventHandler = (e) => {
		e.preventDefault();
		e.stopPropagation();

		setShowWhySeparator(true);
	};

	return (
		<>
			<TooltipInline
				className={className}
				data-tooltip-id={WHY_SEPARATOR_TOOLTIP_ID}
			>
				<Icon icon={Icon.QuestionMark} onClick={showWhyToUseSeparator} />
			</TooltipInline>
			<Tooltip id={WHY_SEPARATOR_TOOLTIP_ID} place="top">
				<TooltipPopup>{t("whySeparator.tooltip")}</TooltipPopup>
			</Tooltip>
			{showWhySeparator &&
				ReactDOM.createPortal(
					<AnimationContainer>
						<WhySeparator onClose={onClose} />
					</AnimationContainer>,
					document.body,
				)}
		</>
	);
}
