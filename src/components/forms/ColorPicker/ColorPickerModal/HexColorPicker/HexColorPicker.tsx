import React, { useRef, useState } from "react";
import { type ColorChangeHandler, SketchPicker } from "react-color";
import { useTranslation } from "react-i18next";

import {
	getColorForSketch,
	isColorTransparent,
	normalizeSketchColor,
} from "@/utils/colors";

import { Label } from "../ColorPickerModal.styled";

const DEBOUNCE_TIMEOUT = 200; // ms

type HexColorPickerProps = React.PropsWithChildren<{
	defaultValue?: string | null;
	setValue: (value: string) => void;
	value: string;
}>;

export function HexColorPicker({
	children,
	defaultValue,
	setValue,
	value,
}: HexColorPickerProps) {
	const { t } = useTranslation();
	const [internalColor, setInternalColor] = useState(value);
	const debounceTime = useRef<ReturnType<typeof setTimeout>>();

	const onChange: ColorChangeHandler = (nextColor, e) => {
		e.preventDefault();
		e.stopPropagation();

		const normalizedColor = normalizeSketchColor(nextColor);
		if (normalizedColor === value) return;

		setInternalColor(normalizedColor);

		if (debounceTime.current) {
			clearTimeout(debounceTime.current);
		}

		debounceTime.current = setTimeout(() => {
			setValue(normalizedColor);
			debounceTime.current = null;
		}, DEBOUNCE_TIMEOUT);
	};

	return (
		<>
			<SketchPicker
				color={getColorForSketch(internalColor, defaultValue)}
				onChange={onChange}
				presetColors={[]}
				width="263px"
			/>
			{children}
			{isColorTransparent(internalColor) && (
				<Label>* {t("color.transparentInfo")}</Label>
			)}
		</>
	);
}
