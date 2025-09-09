import React from "react";
import { useTranslation } from "react-i18next";

import { PopupItem } from "@/components/Navbar/PublishButton/PublishButton.styled";

type PasteProps = {
	col: number;
	row: number;
	onClose: () => void;
	gridPaste: (x: number, y: number) => void;
};

export function Paste({ col, row, onClose, gridPaste }: PasteProps) {
	const { t } = useTranslation();

	const onPasteElement = () => {
		gridPaste(col, row);
		onClose();
	};

	return <PopupItem onClick={onPasteElement}>{t("element.paste")}</PopupItem>;
}
