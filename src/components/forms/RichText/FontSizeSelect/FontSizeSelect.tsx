import React from "react";
import { useSlate } from "slate-react";

import { FieldProvider } from "@/components/FormProvider";

import { Select } from "../../Select";
import { getFontSizeActive, toggleFontSize } from "../utils/font";
import { Container } from "./FontSizeSelect.styled";

export const FONT_SIZES = [
	8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 48, 56,
].map((fontSize) => ({
	label: `${fontSize} px`,
	value: fontSize,
}));

export function FontSizeSelect() {
	const editor = useSlate();
	return (
		<Container>
			<FieldProvider
				name="fontSize"
				setValue={(fontSize) => {
					toggleFontSize(editor, fontSize);
				}}
				value={getFontSizeActive(editor)}
			>
				<Select name="fontSize" options={FONT_SIZES} size="xs" />
			</FieldProvider>
		</Container>
	);
}
