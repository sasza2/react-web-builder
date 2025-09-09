import { useMemo } from "react";
import type { FontImport } from "types";

import { useProperties } from "@/components/PropertiesProvider";
import { DEFAULT_FONT_IMPORT } from "@/consts";

export const useFontImport = (
	selectedFontFamily?: string,
): FontImport | null => {
	const { fonts } = useProperties();

	return useMemo(() => {
		if (!Array.isArray(fonts)) return DEFAULT_FONT_IMPORT;
		return (
			fonts.find((font) => font.value === selectedFontFamily) ||
			DEFAULT_FONT_IMPORT
		);
	}, [fonts, selectedFontFamily]);
};
