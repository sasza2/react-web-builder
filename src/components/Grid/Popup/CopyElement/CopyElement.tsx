import React from "react";
import { useTranslation } from "react-i18next";

import { PopupItem } from "@/components/Navbar/PublishButton/PublishButton.styled";
import { useCopyElements } from "@/hooks/useCopyElements";
import { useSelectedElements } from "@/hooks/useSelectedElements";

type CopyElementProps = {
	elementId: string | number;
	onClose: () => void;
};

export function CopyElement({ elementId, onClose }: CopyElementProps) {
	const { t } = useTranslation();
	const { copyElement } = useCopyElements();
	const { selectedElements } = useSelectedElements();
	const isSelected = selectedElements.includes(elementId);

	const label =
		isSelected && selectedElements.length > 1
			? t("element.copySelected")
			: t("element.copy");

	const onCopyElement = () => {
		copyElement(elementId);
		onClose();
	};

	return <PopupItem onClick={onCopyElement}>{label}</PopupItem>;
}
