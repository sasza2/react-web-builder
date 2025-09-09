import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { PopupItem } from "@/components/Navbar/PublishButton/PublishButton.styled";
import { useElements } from "@/hooks/useElements";
import { useSelectedElements } from "@/hooks/useSelectedElements";
import { getElementsAboveRow, getElementsBelowRow } from "@/utils/element";

type MoveElementsBelowHereProps = {
	onClose: () => void;
	row: number;
};

export function SelectMultipleElements({
	onClose,
	row,
}: MoveElementsBelowHereProps) {
	const { selectedElements, setSelectedElements } = useSelectedElements();
	const { t } = useTranslation();
	const { elements } = useElements();
	const [isVisibleAbove] = useState(
		() => getElementsAboveRow(elements, row + 1).length > 0,
	);

	const [isVisibleBelow] = useState(
		() => getElementsBelowRow(elements, row - 1).length > 0,
	);

	const onDeselectAll = () => {
		setSelectedElements([]);
		onClose();
	};

	const appendElements = (
		func: typeof getElementsAboveRow,
		rowOffset: number,
	) => {
		const combined = new Set([
			...func(elements, row + rowOffset).map((element) => element.id),
			...selectedElements,
		]);

		return [...combined];
	};

	const onSelectAbove = () => {
		setSelectedElements(appendElements(getElementsAboveRow, 1));
		onClose();
	};

	const onSelectBelow = () => {
		setSelectedElements(appendElements(getElementsBelowRow, -1));
		onClose();
	};

	return (
		<>
			{selectedElements.length > 0 && (
				<PopupItem onClick={onDeselectAll}>{t("element.deselect")}</PopupItem>
			)}
			{isVisibleAbove && (
				<PopupItem onClick={onSelectAbove}>
					{t("element.selectAllAbove")}
				</PopupItem>
			)}
			{isVisibleBelow && (
				<PopupItem onClick={onSelectBelow}>
					{t("element.selectAllBelow")}
				</PopupItem>
			)}
		</>
	);
}
