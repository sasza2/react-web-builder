import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { useGridAPI } from "@/components/GridAPIProvider";
import { PopupItem } from "@/components/Navbar/PublishButton/PublishButton.styled";
import { useElements } from "@/hooks/useElements";
import { useSetElements } from "@/hooks/useSetElements";
import {
	getElementsBelowRow,
	getFirstElementBelowRow,
	groupElementsById,
	hasAnyElementAtRowPosition,
} from "@/utils/element";

type MoveElementsBelowHereProps = {
	onClose: () => void;
	row: number;
};

export function RemoveEmptySpaceBelow({
	onClose,
	row,
}: MoveElementsBelowHereProps) {
	const { t } = useTranslation();
	const { elements } = useElements();
	const setElements = useSetElements();
	const gridAPIRef = useGridAPI();
	const [isVisible] = useState(() => {
		if (
			hasAnyElementAtRowPosition(
				elements,
				row,
				gridAPIRef.current.measureElementHeight,
			)
		) {
			return false;
		}

		return !!getFirstElementBelowRow(elements, row);
	});

	const onRemoveEmptySpaceBelow = () => {
		const firstElementBelow = getFirstElementBelowRow(elements, row);
		if (!firstElementBelow) return;

		const diff = firstElementBelow.y - row;

		const elementsBelowMap = groupElementsById(
			getElementsBelowRow(elements, row),
		);

		setElements(
			elements.map((element) => {
				if (!elementsBelowMap[element.id]) return element;
				return {
					...element,
					y: element.y - diff,
				};
			}),
		);

		onClose();
	};

	if (!isVisible) return null;
	return (
		<PopupItem onClick={onRemoveEmptySpaceBelow}>
			{t("element.removeEmptySpaceBelow")}
		</PopupItem>
	);
}
